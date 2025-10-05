import { JSX } from 'react'
import { genereLabelContent } from '../app/Dymo'
import { Inscrit, Offre } from '@renderer/features/inscrits/inscritsSlice'

interface EtiquetteProps {
  inscrit?: Inscrit
  saison: string
  dymo: any
}

function formatCreneaux(creneaux: Array<{ lieu: string; heure: string }>) {
  return creneaux.map((cr) => `${cr.lieu} - ${cr.heure}`).join(', ')
}

function formatOffre(o: Offre) {
  if (o.creneaux.length > 2) {
    return o.titreCourt
  } else {
    return `${o.titreCourt} - ${formatCreneaux(o.creneaux)}`
  }
}

function formatOffres(offres: Array<Offre>) {
  return offres.map(formatOffre).join('\n')
}

function Etiquette({ inscrit, saison, dymo }: Readonly<EtiquetteProps>): JSX.Element {
  const nom = inscrit?.nom ?? ''
  const labelData = genereLabelContent(nom, formatOffres(inscrit?.offres ?? []), saison)
  const label = dymo.openLabelXml(labelData)
  const pngData = 'data:image/png;base64,' + label.render()
  return (
    <img
      alt={`Étiquette ${saison} pour ${nom} avec les créneaux ${formatOffres(inscrit?.offres ?? [])}`}
      src={pngData}
    />
  )
}
export default Etiquette
