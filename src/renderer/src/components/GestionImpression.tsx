import { Button, Divider, Paper, Stack, TextField } from '@mui/material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch } from '../app/store'
import { selectAnnee } from '../features/configuration/configurationSlice'
import { printAll, selectDisplayedAdherent } from '../features/impression/impressionSlice'
import Etiquette from './Etiquette'
import EtiquettePersonnalisee from './EtiquettePersonnalisee'

export const GestionImpression = ({ selectedAdherents }: { selectedAdherents: string[] }) => {
  const dispatch: AppDispatch = useDispatch()
  const displayedAdherent = useSelector(selectDisplayedAdherent)
  const [nbPrint, setNbPrint] = useState(1)
  const saison = useSelector(selectAnnee)
  return (
    <Stack alignItems="center" alignContent={'center'} spacing={2}>
      <Paper>
        <Etiquette adherent={displayedAdherent} saison={saison} />
      </Paper>
      <Button
        variant="contained"
        onClick={() => {
          dispatch(printAll(saison, selectedAdherents, 1))
        }}
      >
        Imprimer cette étiquette
      </Button>
      <Stack direction="row" alignItems="center" alignContent={'center'} spacing={2}>
        <TextField
          type="number"
          label="Nombre d'étiquettes à imprimer"
          fullWidth
          value={nbPrint}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const nb = Number(event.target.value)
            setNbPrint(Math.max(nb, 0))
          }}
        />
        <Button
          variant="contained"
          onClick={() => {
            dispatch(printAll(saison, selectedAdherents, nbPrint))
          }}
        >
          Imprimer {nbPrint} étiquette{nbPrint > 1 ? 's' : ''}
        </Button>
      </Stack>
      <Divider variant="fullWidth" flexItem />
      <Stack direction="row" alignContent="left" spacing={2} width={'100%'}></Stack>
      <EtiquettePersonnalisee />
    </Stack>
  )
}
