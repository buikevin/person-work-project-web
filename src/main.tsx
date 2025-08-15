import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { ApolloProvider } from '@apollo/client'
import { store } from './store/store'
import apolloClient from './server/server'
import { ThemeProvider } from './contexts/ThemeContext'
import { AppWrapper } from './components/AppWrapper'
import { Toaster } from './components/ui/toaster'
import './lib/i18n'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider>
          <Suspense fallback={
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          }>
            <AppWrapper />
            <Toaster />
          </Suspense>
        </ThemeProvider>
      </ApolloProvider>
    </Provider>
  </React.StrictMode>,
)
