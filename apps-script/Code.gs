/**
 * Registrations backend for the website.
 * Lives inside your Google Sheet (Extensions -> Apps Script).
 * Saves every registration as a row and powers the /admin page.
 *
 * SETUP (once): Project Settings (gear icon) -> Script properties -> add ADMIN_PASSWORD.
 * Then Deploy -> New deployment -> Web app (Execute as: Me, Who has access: Anyone).
 */

var SHEET_NAME = 'Registrations';
var HEADERS = ['ID', 'Submitted At', 'Full Name', 'Email', 'Phone / WhatsApp', 'Country',
  'Interest', 'Preferred Contact', 'Message', 'Status', 'Assigned Handler', 'Notes'];
var STATUSES = ['new', 'contacted', 'handler_assigned', 'onboarding', 'completed', 'closed'];
var INTERESTS = ['ai_training', 'outlier', 'handshake', 'not_sure'];
var CONTACTS = ['whatsapp', 'email'];
var TOKEN_TTL_MS = 12 * 60 * 60 * 1000; // admin stays signed in for 12 hours
var NCOLS = HEADERS.length;

/* ───────────── entry points ───────────── */

function doGet() {
  return json_({ ok: true, data: { status: 'running' } });
}

function doPost(e) {
  try {
    var req = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var data;
    switch (req.action) {
      case 'submit':   data = submit_(req); break;
      case 'activity': data = activity_(); break;
      case 'login':    data = login_(req); break;
      case 'list':     requireAdmin_(req); data = list_(); break;
      case 'update':   requireAdmin_(req); data = update_(req); break;
      case 'remove':   requireAdmin_(req); data = remove_(req); break;
      default: throw err_('BAD_REQUEST', 'Unknown request.');
    }
    return json_({ ok: true, data: data });
  } catch (ex) {
    if (!ex.code) console.error(ex && ex.stack ? ex.stack : ex);
    return json_({
      ok: false,
      code: ex.code || 'INTERNAL',
      error: ex.code ? ex.message : 'Something went wrong. Please try again.'
    });
  }
}

/** Run this once from the editor (Run button) to authorise the script and create the sheet. */
function setupSheet() {
  sheet_();
  return 'Sheet is ready.';
}

/* ───────────── actions ───────────── */

function submit_(req) {
  var v = validate_(req);
  var cache = CacheService.getScriptCache();

  var n = Number(cache.get('rate_min') || 0);
  if (n >= 30) throw err_('TOO_MANY', 'Too many submissions right now. Please try again in a minute.');
  cache.put('rate_min', String(n + 1), 60);

  // Same email twice within 10 minutes = a double click; accept silently, store once.
  var dupKey = 'dup_' + hash_(v.email.toLowerCase());
  if (cache.get(dupKey)) return { ok: true };
  cache.put(dupKey, '1', 600);

  return withLock_(function () {
    var sh = sheet_();
    var last = sh.getLastRow();
    var id = nextId_(sh, last);
    var row = last + 1;
    sh.getRange(row, 3, 1, NCOLS - 2).setNumberFormat('@'); // plain text: no formulas, keeps +234…
    sh.getRange(row, 2).setNumberFormat('yyyy-mm-dd hh:mm');
    sh.getRange(row, 1, 1, NCOLS).setValues([[
      id, new Date(), v.fullName, v.email, v.phone, v.country,
      v.interest, v.preferredContact, v.message, 'new', '', ''
    ]]);
    cache.remove('activity');
    return { ok: true };
  });
}

function activity_() {
  var cache = CacheService.getScriptCache();
  var hit = cache.get('activity');
  if (hit) return JSON.parse(hit);

  var sh = sheet_();
  var last = sh.getLastRow();
  var total = Math.max(0, last - 1);
  var recent = 0, latest = null;
  if (total > 0) {
    var since = Date.now() - 24 * 60 * 60 * 1000;
    var dates = sh.getRange(2, 2, total, 1).getValues();
    for (var i = 0; i < dates.length; i++) {
      var t = toDate_(dates[i][0]);
      if (!t) continue;
      if (t.getTime() >= since) recent++;
      if (!latest || t > latest) latest = t;
    }
  }
  var out = { last24h: recent, total: total, latestAt: latest ? latest.toISOString() : null };
  cache.put('activity', JSON.stringify(out), 60);
  return out;
}

function login_(req) {
  var cache = CacheService.getScriptCache();
  var fails = Number(cache.get('login_fails') || 0);
  if (fails >= 5) throw err_('TOO_MANY', 'Too many wrong attempts. Try again in 15 minutes.');

  var pw = PropertiesService.getScriptProperties().getProperty('ADMIN_PASSWORD');
  if (!pw) throw err_('NOT_CONFIGURED', 'Admin password is not set yet. Add ADMIN_PASSWORD in Script properties.');

  if (!safeEqual_(hash_(String(req.password || '')), hash_(pw))) {
    cache.put('login_fails', String(fails + 1), 900);
    throw err_('UNAUTHORIZED', 'Incorrect password.');
  }
  cache.remove('login_fails');
  return { token: issueToken_() };
}

function list_() {
  var sh = sheet_();
  var last = sh.getLastRow();
  var rows = [];
  if (last > 1) {
    var values = sh.getRange(2, 1, last - 1, NCOLS).getValues();
    for (var i = 0; i < values.length; i++) {
      var r = values[i];
      var id = Number(r[0]);
      if (!id) continue;
      var d = toDate_(r[1]);
      rows.push({
        id: id,
        submittedAt: d ? d.toISOString() : new Date(0).toISOString(),
        fullName: String(r[2]), email: String(r[3]), phone: String(r[4]),
        country: String(r[5]), interest: String(r[6]), preferredContact: String(r[7]),
        message: String(r[8]),
        status: STATUSES.indexOf(String(r[9])) >= 0 ? String(r[9]) : 'new',
        assignedHandler: String(r[10]), notes: String(r[11])
      });
    }
    rows.sort(function (a, b) { return a.submittedAt < b.submittedAt ? 1 : -1; });
  }
  return { rows: rows, sheetUrl: SpreadsheetApp.getActiveSpreadsheet().getUrl() };
}

function update_(req) {
  return withLock_(function () {
    var sh = sheet_();
    var row = findRow_(sh, req.id);
    var cur = sh.getRange(row, 10, 1, 3).getValues()[0];
    var status = cur[0], handler = cur[1], notes = cur[2];
    if (req.status !== undefined) {
      if (STATUSES.indexOf(req.status) < 0) throw err_('BAD_REQUEST', 'Invalid status.');
      status = req.status;
    }
    if (req.assignedHandler !== undefined) handler = clean_(req.assignedHandler, 120);
    if (req.notes !== undefined) notes = clean_(req.notes, 2000);
    sh.getRange(row, 10, 1, 3).setNumberFormat('@').setValues([[status, handler, notes]]);
    return { ok: true };
  });
}

function remove_(req) {
  return withLock_(function () {
    var sh = sheet_();
    sh.deleteRow(findRow_(sh, req.id));
    CacheService.getScriptCache().remove('activity');
    return { ok: true };
  });
}

/* ───────────── helpers ───────────── */

function validate_(req) {
  var v = {
    fullName: clean_(req.fullName, 120),
    email: clean_(req.email, 255),
    phone: clean_(req.phone, 32),
    country: clean_(req.country, 120),
    interest: String(req.interest || ''),
    preferredContact: String(req.preferredContact || ''),
    message: clean_(req.message || '', 2000)
  };
  if (v.fullName.length < 2) throw err_('BAD_REQUEST', 'Please enter your full name.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) throw err_('BAD_REQUEST', 'Please enter a valid email address.');
  if (v.phone.length < 7) throw err_('BAD_REQUEST', 'Please enter a valid phone or WhatsApp number.');
  if (v.country.length < 2) throw err_('BAD_REQUEST', 'Please select your country.');
  if (INTERESTS.indexOf(v.interest) < 0) throw err_('BAD_REQUEST', 'Please select what you are interested in.');
  if (CONTACTS.indexOf(v.preferredContact) < 0) throw err_('BAD_REQUEST', 'Please choose a contact method.');
  return v;
}

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    var first = ss.getSheets()[0];
    if (first && first.getLastRow() === 0) { sh = first; sh.setName(SHEET_NAME); }
    else sh = ss.insertSheet(SHEET_NAME);
  }
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, NCOLS).setValues([HEADERS])
      .setFontWeight('bold').setBackground('#1F3D2F').setFontColor('#FFFFFF');
    sh.setFrozenRows(1);
    sh.setColumnWidths(1, 1, 50);
    sh.setColumnWidths(2, 1, 140);
    sh.setColumnWidths(3, 4, 170);
    sh.setColumnWidths(7, 4, 130);
    sh.setColumnWidths(9, 1, 320);
    sh.setColumnWidths(10, 2, 150);
    sh.setColumnWidths(12, 1, 320);
  }
  return sh;
}

function nextId_(sh, last) {
  if (last < 2) return 1;
  var ids = sh.getRange(2, 1, last - 1, 1).getValues();
  var max = 0;
  for (var i = 0; i < ids.length; i++) max = Math.max(max, Number(ids[i][0]) || 0);
  return max + 1;
}

function findRow_(sh, id) {
  id = Number(id);
  var last = sh.getLastRow();
  if (!id || last < 2) throw err_('NOT_FOUND', 'Registration not found.');
  var ids = sh.getRange(2, 1, last - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) if (Number(ids[i][0]) === id) return i + 2;
  throw err_('NOT_FOUND', 'Registration not found.');
}

function withLock_(fn) {
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try { return fn(); } finally { lock.releaseLock(); }
}

function clean_(s, max) {
  return String(s == null ? '' : s).replace(/^\s+|\s+$/g, '').substring(0, max);
}

function toDate_(v) {
  if (v instanceof Date) return isNaN(v.getTime()) ? null : v;
  var d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

function err_(code, message) {
  var e = new Error(message);
  e.code = code;
  return e;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* ───────────── admin session tokens ───────────── */

function secret_() {
  var p = PropertiesService.getScriptProperties();
  var s = p.getProperty('TOKEN_SECRET');
  if (!s) { s = Utilities.getUuid() + Utilities.getUuid(); p.setProperty('TOKEN_SECRET', s); }
  return s;
}

function sign_(payload) {
  return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(payload, secret_()));
}

function issueToken_() {
  var exp = String(Date.now() + TOKEN_TTL_MS);
  return exp + '.' + sign_(exp);
}

function requireAdmin_(req) {
  var t = String(req.token || '').split('.');
  var ok = t.length === 2 && safeEqual_(t[1], sign_(t[0])) && Number(t[0]) > Date.now();
  if (!ok) throw err_('UNAUTHORIZED', 'Please sign in again.');
}

function hash_(s) {
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, s, Utilities.Charset.UTF_8);
  return bytes.map(function (b) { return ('0' + (b & 0xff).toString(16)).slice(-2); }).join('');
}

function safeEqual_(a, b) {
  if (a.length !== b.length) return false;
  var diff = 0;
  for (var i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
