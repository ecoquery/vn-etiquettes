// import { electron } from 'process'
import { JSX, useState } from 'react'

function Versions(): JSX.Element {
  const pversions = window?.electron?.process?.versions
  const [versions] = useState(pversions)

  return (
    <ul className="versions">
      <li className="electron-version">Electron v{versions?.electron}</li>
      <li className="chrome-version">Chromium v{versions?.chrome}</li>
      <li className="node-version">Node v{versions?.node}</li>
    </ul>
  )
}

export default Versions
