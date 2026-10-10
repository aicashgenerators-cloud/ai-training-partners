import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import Register from './pages/Register'
import Success from './pages/Success'
import Admin from './pages/Admin'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/success" element={<Success />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  )
}
