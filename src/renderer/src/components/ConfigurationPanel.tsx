import { Container, Stack, TextField } from '@mui/material'
import { selectAnnee, updateAnnee } from '@renderer/features/configuration/configurationSlice'
import { useDispatch, useSelector } from 'react-redux'

export const ConfigurationPanel = () => {
  const dispatch = useDispatch()
  const annee = useSelector(selectAnnee)
  return (
    <Container>
      <Stack spacing={2}>
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
