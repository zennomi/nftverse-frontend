import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import router from './configs/router.tsx'
import { AppProvider } from './contexts/AppProvider.tsx'
import { WalletProvider } from './contexts/WalletProvider.tsx'

const client = new ApolloClient({
  uri: 'http://localhost:4350/graphql',
  cache: new InMemoryCache(),
});

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
