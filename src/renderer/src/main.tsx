import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { getDymo } from './app/Dymo'
import { Provider } from 'react-redux'
import { store } from './app/store'
import { loadConfiguration } from './features/configuration/configurationSlice'

// Load DYMO js lib before building react app
async function run() {
  try {
    const dymo = await getDymo()
    store.dispatch(loadConfiguration)

    ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
      <React.StrictMode>
        <Provider store={store}>
          <App dymo={dymo} />
        </Provider>
      </React.StrictMode>
    )
  } catch (e) {
    console.error('Erreur dans main: ', e)
  }
}

await run()
