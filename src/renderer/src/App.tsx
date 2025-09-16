import Versions from './components/Versions'
import { JSX } from 'react'
import Etiquette from './components/Etiquette'
import { ComitiFileHandler } from './components/ComitiFileHandler'
import { useSelector } from 'react-redux'
import { selectSelected } from './features/inscrits/inscritsSlice'

const debugDymo = false

function App({ dymo }): JSX.Element {
  if (debugDymo) {
    if (dymo !== undefined) {
      console.log(dymo)
    } else {
      console.error('dymo is undefined')
    }
  }

  const selectedInscrit = useSelector(selectSelected)

  return (
    <>
      <Etiquette inscrit={selectedInscrit} saison={'2025-2026'} dymo={dymo} />
      <ComitiFileHandler />
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>&nbsp;and{' '}
        <span className="ts">TypeScript</span>
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
      </div>
      <Versions></Versions>
    </>
  )
}

export default App
