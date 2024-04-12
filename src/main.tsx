import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './configs/router.tsx'
import { AppProvider } from './contexts/AppProvider.tsx'
import { WalletProvider } from './contexts/WalletProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <WalletProvider>
        <RouterProvider router={router} />
      </WalletProvider>
    </AppProvider>
  </React.StrictMode>,
)
