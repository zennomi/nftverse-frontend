import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client';
import router from './configs/router.tsx'
import { AppProvider } from './contexts/AppProvider.tsx'
import { WalletProvider } from './contexts/WalletProvider.tsx'
import { client } from './configs/apollo.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AppProvider>
        <WalletProvider>
          <RouterProvider router={router} />
        </WalletProvider>
      </AppProvider>
    </ApolloProvider>
  </React.StrictMode>,
)
