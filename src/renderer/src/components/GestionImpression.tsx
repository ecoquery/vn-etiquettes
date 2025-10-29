import { selectSelected } from '../features/inscrits/inscritsSlice'
import { useDispatch, useSelector } from 'react-redux'
import Etiquette from './Etiquette'
import { useState } from 'react'
import { Button, Checkbox, FormControlLabel, Paper, Stack, TextField } from '@mui/material'
import { printAll, setSimulatePrint } from '@renderer/features/impression/impressionSlice'
import { AppDispatch } from '@renderer/app/store'

export const GestionImpression = ({ dymo }) => {
  const dispatch: AppDispatch = useDispatch()
  const selectedInscrit = useSelector(selectSelected)
  const [nbPrint, setNbPrint] = useState(1)
  const saison = '2025-2026'
  return (
    <Stack alignItems="center" alignContent={'center'} spacing={2}>
      <Paper>
        <Etiquette inscrit={selectedInscrit} saison={saison} dymo={dymo} />
      </Paper>
      <Button
        variant="contained"
        onClick={() => {
          dispatch(printAll(dymo, saison, 1))
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
            dispatch(printAll(dymo, saison, nbPrint))
          }}
        >
          Imprimer {nbPrint} étiquette{nbPrint > 1 ? 's' : ''}
        </Button>
      </Stack>

      <Stack direction="row" alignContent="left" spacing={2} width={'100%'}>
        <FormControlLabel
          control={
            <Checkbox
              defaultChecked
              onChange={(event) => {
                dispatch(setSimulatePrint(event.target.checked))
              }}
            />
          }
          label="Simuler l'impression"
        />
      </Stack>
    </Stack>
  )
}
