import { Button, Stack, TextField } from '@mui/material'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectAnnee, selectSimulatePrint } from '../features/configuration/configurationSlice'
import { selectDefaultPrinter } from '../features/dymo/dymoSlice'
import { print, selectDisplayedAdherent } from '../features/impression/impressionSlice'
import Etiquette from './Etiquette'
import type { AdherentDisplay } from './adherentDisplay'

const EtiquettePersonnalisee = () => {
  const saison = useSelector(selectAnnee) as string
  const displayedAdherent = useSelector(selectDisplayedAdherent)
  const [nom, setNom] = useState(displayedAdherent?.nom ?? '')
  const [creneaux, setCreneaux] = useState((displayedAdherent?.creneaux ?? []).join('\n'))
  const printer = useSelector(selectDefaultPrinter)
  const simulatePrint = useSelector(selectSimulatePrint)

  const mkAdherent = () =>
    ({ nom, creneaux: [creneaux], affiche: true, id: nom }) as AdherentDisplay

  const printEtiquette = async () => {
    const adherent = mkAdherent()
    if (simulatePrint || !printer) {
      console.log(`Simule l'impression de `, adherent)
    } else {
      await print(adherent, saison, printer)
    }
  }

  const reinitToAdherent = () => {
    setNom(displayedAdherent?.nom ?? '')
    setCreneaux((displayedAdherent?.creneaux ?? []).join('\n'))
  }

  return (
    <Stack spacing={2}>
      <Etiquette saison={saison} adherent={mkAdherent()} />
      <TextField
        label="Nom"
        value={nom}
        onChange={(event) => {
          setNom(event.target.value)
        }}
      />
      <TextField
        label="Créneaux"
        multiline
        rows={4}
        value={creneaux}
        onChange={(event) => {
          setCreneaux(event.target.value)
        }}
      />
      <Stack spacing={2}>
        <Button variant="contained" onClick={printEtiquette}>
          Imprimer cette étiquette
        </Button>
        <Button variant="contained" onClick={reinitToAdherent}>
          Réinitialiser
        </Button>
      </Stack>
    </Stack>
  )
}
export default EtiquettePersonnalisee
