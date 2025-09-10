import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { getDymo } from './app/Dymo'
// import dymoURL from './assets/DYMO.Label.Framework.3.0.txt'
import Papa from 'papaparse'
import { Provider } from 'react-redux'
import { store } from './app/store'

// Load DYMO js lib before building react app
async function run() {
  const dymo = await getDymo()

  const printers = dymo.getPrinters()
  const printerInfo = printers.length > 0 ? printers[0].name : "Pas d'imprimante"

  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <Provider store={store}>
        <p>Salut</p>
        <p>Imprimante: {printerInfo}</p>
        <App dymo={dymo} />
      </Provider>
    </React.StrictMode>
  )
}

run()
