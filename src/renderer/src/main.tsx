import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import dymoURL from './assets/DYMO.Label.Framework.3.0.txt'

// Load DYMO js lib before building react app
fetch(dymoURL)
  .then((r) => r.text())
  .then((script) => {
    console.log(`got script, length: ${script.length}`)
    eval(script)

    const printers = dymo.label.framework.getPrinters()
    const printerInfo = printers.length > 0 ? printers[0].name : "Pas d'imprimante"

    ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
      <React.StrictMode>
        <p>Salut</p>
        <p>Imprimante: {printerInfo}</p>
        <App />
      </React.StrictMode>
    )
  })
