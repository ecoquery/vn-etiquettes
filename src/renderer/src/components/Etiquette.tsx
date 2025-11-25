import { JSX, useEffect, useState } from 'react'
import { genereLabelContent } from '../app/Dymo'
import { Inscrit, Offre } from '@renderer/features/inscrits/inscritsSlice'
import { Alert } from '@mui/material'
import { selectDefaultPrinter } from '@renderer/features/dymo/dymoSlice'
import { useSelector } from 'react-redux'
import { dymo } from '@renderer/app/Dymo'

interface EtiquetteProps {
  inscrit?: Inscrit
  saison: string
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

export function formatOffres(offres: Array<Offre>) {
  return offres.map(formatOffre).join('\n')
}

function Etiquette({ inscrit, saison }: Readonly<EtiquetteProps>): JSX.Element {
  const nom = inscrit?.nom ?? ''
  const labelData = genereLabelContent(nom, formatOffres(inscrit?.offres ?? []), saison)
  const printer = useSelector(selectDefaultPrinter)
  const [labelContent, setLabelContent] = useState<string | undefined>(undefined)

  useEffect(() => {
    dymo.renderLabel(labelData).then((response) => {
      if (response.success) {
        setLabelContent(response.data as string)
      } else {
        setLabelContent(undefined)
        console.error(response.data)
      }
    })
  }, [inscrit, saison])

  if (printer === undefined) {
    return (
      <Alert severity="error">
        Pas d'imprimante
        <br />
        Lancer le logiciel Dymo, puis relancer cette application.
      </Alert>
    )
  }
  if (labelContent === undefined) {
    return <Alert severity="info">Génération de l'étiquette ...</Alert>
  } else {
    return (
      <img
        alt={`Étiquette ${saison} pour ${nom} avec les créneaux ${formatOffres(inscrit?.offres ?? [])}`}
        src={labelContent}
      />
    )
  }
}
export default Etiquette
