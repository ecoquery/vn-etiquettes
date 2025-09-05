import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'
import { JSX } from 'react'
import Etiquette from './components/Etiquette'

const debugDymo = false

function App({ dymo }): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  // const d = dymo.label.framework
  if (debugDymo) {
    if (dymo !== undefined) {
      console.log(dymo)
    } else {
      console.error('dymo is undefined')
    }
  }
  return (
    <>
      {/* <img alt="logo" className="logo" src={electronLogo} /> */}
      <Etiquette
        etiquetteData={{ nom: 'un nom', creneaux: 'des\ncréneaux', saison: 'une saison' }}
        dymo={dymo}
      />
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="actions">
        <div className="action">
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
            Send IPC
          </a>
        </div>
      </div>
      <Versions></Versions>
    </>
  )
}

export default App
