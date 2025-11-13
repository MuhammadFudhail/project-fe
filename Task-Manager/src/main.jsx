// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

//kode baru
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import UseProvider from './context/userContext' // ✅ Import provider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UseProvider> {/* ✅ Bungkus App dengan Provider */}
      <App />
    </UseProvider>
  </StrictMode>,
)
