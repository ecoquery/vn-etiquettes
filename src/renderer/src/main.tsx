import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux'
import { store } from './app/store'
import { loadConfiguration } from './features/configuration/configurationSlice'
import { updatePrinters } from './features/dymo/dymoSlice'

// Load DYMO js lib before building react app
async function run() {
  try {
    store.dispatch(loadConfiguration)
    store.dispatch(updatePrinters)

    ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
      <React.StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </React.StrictMode>
    )
  } catch (e) {
    console.error('Erreur dans main: ', e)
  }
}

await run()
