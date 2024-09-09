import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Load DYMO js lib before building react app
fetch('/src/assets/DYMO.Label.Framework.3.0.js')
  .then((r) => r.text())
  .then((script) => {
    console.log(`got script, length: ${script.length}`)
    eval(script)

    ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  })
