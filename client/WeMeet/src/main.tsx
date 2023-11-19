import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { UserAuthProvider } from './contexts/UserAuth.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserAuthProvider>
    <App />
    </UserAuthProvider>
  </React.StrictMode>,
)
