import { Button, Container, Stack, TextField } from '@mui/material'
import { AppDispatch } from '@renderer/app/store'
import {
  loadConfiguration,
  saveConfiguration,
  selectAnnee,
  updateAnnee
} from '@renderer/features/configuration/configurationSlice'
import { useDispatch, useSelector } from 'react-redux'

export const ConfigurationPanel = () => {
  const dispatch: AppDispatch = useDispatch()
  const annee = useSelector(selectAnnee)
  return (
    <Container>
      <Stack alignItems={'center'} spacing={2}>
        <Stack direction={'row'} spacing={2}>
          <Button
            variant="contained"
            onClick={() => {
              dispatch(saveConfiguration)
            }}
          >
            Sauver
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              dispatch(loadConfiguration)
            }}
          >
            Restaurer
          </Button>
        </Stack>
        <TextField
          label="Année"
          value={annee}
          onChange={(event) => {
            dispatch(updateAnnee(event.target.value))
          }}
        ></TextField>
      </Stack>
    </Container>
  )
}
