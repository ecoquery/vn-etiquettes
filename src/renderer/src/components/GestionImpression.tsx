import { selectSelected } from '../features/inscrits/inscritsSlice'
import { useSelector } from 'react-redux'
import Etiquette from './Etiquette'
import { useState } from 'react'
import { Button, Checkbox, FormControlLabel, Paper, Stack, TextField } from '@mui/material'

export const GestionImpression = ({ dymo }) => {
  const selectedInscrit = useSelector(selectSelected)
  const [nbPrint, setNbPrint] = useState(1)
  return (
    <Stack alignItems="center" alignContent={'center'} spacing={2}>
      <Paper>
        <Etiquette inscrit={selectedInscrit} saison={'2025-2026'} dymo={dymo} />
      </Paper>
      <Button variant="contained">Imprimer cette étiquette</Button>
      <TextField
        type="number"
        label="Nombre d'étiquettes à imprimer"
        fullWidth
        value={nbPrint}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const nb = Number(event.target.value)
          setNbPrint(nb < 0 ? 0 : nb)
        }}
      />
      <Button variant="contained">
        Imprimer {nbPrint} étiquette{nbPrint > 1 ? 's' : ''}
      </Button>
      <Stack direction="row" alignContent="left" spacing={2} width={'100%'}>
        <FormControlLabel control={<Checkbox defaultChecked />} label="Simuler l'impression" />
      </Stack>
    </Stack>
  )
}
