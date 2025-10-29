import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { getDymo } from './app/Dymo'
import { Provider } from 'react-redux'
import { store } from './app/store'

// Load DYMO js lib before building react app
async function run() {
  const dymo = await getDymo()

  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <Provider store={store}>
        <App dymo={dymo} />
      </Provider>
    </React.StrictMode>
  )
}

run()
