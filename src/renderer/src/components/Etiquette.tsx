import { JSX } from 'react'
import { genereLabelContent } from '../app/Dymo'

function Etiquette({ etiquetteData, dymo }): JSX.Element {
  const { nom, creneaux, saison } = etiquetteData
  const labelData = genereLabelContent(nom, creneaux, saison)
  const label = dymo.openLabelXml(labelData)
  const pngData = label.render()
  return <img src={'data:image/png;base64,' + pngData} />
}
export default Etiquette
