import { Alert } from '@mui/material'
import type { JSX } from 'react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { dymo, genereLabelContent } from '../app/Dymo'
import { nomSimple, type Adherent } from '../features/adherents/adherentsSlice'
import type { Alias } from '../features/configuration/configurationSlice'
import { selectAliasPiscines } from '../features/configuration/configurationSlice'
import type { Creneau } from '../features/creneaux/creneauxSlice'
import { selectDefaultPrinter } from '../features/dymo/dymoSlice'

interface EtiquetteProps {
  adherent?: Adherent
  saison: string
}

export function formatCreneaux(cr: Record<string, Creneau>, piscineAlias: Record<string, Alias>) {
  const creneaux = Object.values(cr)
  const activitesSansSeances = new Set(
    creneaux
      .filter((c) => c.activite.sansseance && !c.activite.sanscarte)
      .map((c) => c.activite.nom)
  )
  const creneauxAAfficher = creneaux
    .filter((c) => !(c.activite.nom in activitesSansSeances) && !c.activite.sanscarte)
    .map((c) => `${c.jour} ${c.debut} - ${piscineAlias[c.lieu ?? ''].replacement ?? c.lieu}`)
  return Array.from(activitesSansSeances).concat(creneauxAAfficher).join('\n')
}

function Etiquette({ adherent, saison }: Readonly<EtiquetteProps>): JSX.Element {
  const aliasPiscine = useSelector(selectAliasPiscines)
  const nom = adherent ? nomSimple(adherent) : ''
  const creneauxString = formatCreneaux(adherent?.creneaux ?? {}, aliasPiscine)
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
        alt={`Étiquette ${saison} pour ${nom} avec les créneaux ${formatCreneaux(adherent?.creneaux ?? {}, aliasPiscine)}`}
        src={labelContent}
      />
    )
  }
}
export default Etiquette
