import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Header from './Components/Header.tsx'
import Footer from './Components/Footer.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Header/>
    <App />
    <Footer/>
  </StrictMode>,
)
