import { Alert } from '@mui/material'
import type { JSX } from 'react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { dymo, genereLabelContent } from '../app/Dymo'
import type { Alias } from '../features/configuration/configurationSlice'
import type { Activite, Creneau } from '../features/creneaux/creneauxSlice'
import { selectDefaultPrinter } from '../features/dymo/dymoSlice'
import type { AdherentDisplay } from './adherentDisplay'

interface EtiquetteProps {
  adherent?: AdherentDisplay
  saison: string
}

export function formatCreneaux(
  cr: string[],
  activites: Record<string, Activite>,
  creneaux: Record<string, Creneau>,
  piscineAlias: Record<string, Alias>
) {
  const crC = cr.map((c) => creneaux[c])
  const activitesSansSeances = new Set(
    crC
      .filter((c) => activites[c.activite]?.sansseance && !activites[c.activite]?.sanscarte)
      .map((c) => c.activite)
  )
  const creneauxAAfficher = crC
    .filter((c) => !(c.activite in activitesSansSeances) && !activites[c.activite]?.sanscarte)
    .map((c) => `${c.jour} ${c.debut} - ${piscineAlias[c.lieu ?? ''].replacement ?? c.lieu}`)
  return Array.from(activitesSansSeances).concat(creneauxAAfficher).join('\n')
}

function Etiquette({ adherent, saison }: Readonly<EtiquetteProps>): JSX.Element {
  const nom = adherent?.nom ?? ''
  const creneauxString = (adherent?.creneaux ?? []).join('\n')
  const labelData = genereLabelContent(nom, creneauxString, saison)
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
  }, [labelData])

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
        alt={`Étiquette ${saison} pour ${nom} avec les créneaux ${creneauxString}`}
        src={labelContent}
      />
    )
  }
}
export default Etiquette
