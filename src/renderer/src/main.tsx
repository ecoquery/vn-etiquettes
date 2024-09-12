import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import dymoURL from './assets/DYMO.Label.Framework.3.0.txt'
import Papa from 'papaparse'

// Load DYMO js lib before building react app
fetch(dymoURL)
  .then((r) => r.text())
  .then((script) => {
    console.log(`got dymo script, length: ${script.length}`)
    const updatedScript = script.substring(0, script.length - 4) + '.call(globalThis);'
    eval(updatedScript)

    const printers = dymo.label.framework.getPrinters()
    const printerInfo = printers.length > 0 ? printers[0].name : "Pas d'imprimante"

    ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
      <React.StrictMode>
        <p>Salut</p>
        <p>Imprimante: {printerInfo}</p>
        <p>Papaparse works: {Papa + ''}</p>
        <App />
      </React.StrictMode>
    )
  })
