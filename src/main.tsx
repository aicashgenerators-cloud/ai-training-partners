import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import { QueryProvider } from "@/providers/query"
import { ContentProvider } from "@/lib/i18n"
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <QueryProvider>
        <ContentProvider>
          <App />
        </ContentProvider>
      </QueryProvider>
    </BrowserRouter>
  </StrictMode>,
)
