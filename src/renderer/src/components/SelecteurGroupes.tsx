import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack } from '@mui/material'
import {
  activiteSelected,
  offreSelected,
  selectActivites,
  selectOffres,
  selectSelectedActivite,
  selectSelectedOffre,
  stringOfOffre
} from '@renderer/features/inscrits/inscritsSlice'
import { Container } from 'react-bulma-components'
import { useDispatch, useSelector } from 'react-redux'

export default function SelecteurGroupes() {
  const dispatch = useDispatch()
  const activites = useSelector(selectActivites)
  const selectedActivite = useSelector(selectSelectedActivite)
  const offres = useSelector(selectOffres)
  const selectedOffre = useSelector(selectSelectedOffre)
  const filteredOffres = selectedActivite
    ? offres.filter((o) => o.activite == selectedActivite)
    : offres

  const toutes = 'toutes'

  const handleChangeActivite = (event: SelectChangeEvent) => {
    const value = event.target.value === toutes ? undefined : event.target.value
    dispatch(activiteSelected(value))
  }
  const handleChangeOffre = (event: SelectChangeEvent) => {
    dispatch(offreSelected(Number(event.target.value)))
  }

  return (
    <Container>
      <Stack direction="row" spacing={2}>
        <FormControl>
          <InputLabel id="activite-select-label">Activité</InputLabel>
          <Select
            labelId="activite-select-label"
            id="activite-simple-select"
            value={selectedActivite ?? toutes}
            label="Activité"
            onChange={handleChangeActivite}
          >
            <MenuItem value={toutes}>Toutes</MenuItem>
            {activites.map((activite) => (
              <MenuItem key={activite} value={activite}>
                {activite}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="offre-select-label">Offre</InputLabel>
          <Select
            labelId="offre-select-label2"
            id="offre-simple-select"
            value={selectedOffre ? String(selectedOffre.nOffre) : toutes}
            label="Offre"
            onChange={handleChangeOffre}
          >
            <MenuItem value={toutes}>Toutes</MenuItem>
            {filteredOffres.map((o) => (
              <MenuItem key={o.nOffre} value={o.nOffre + ''}>
                {stringOfOffre(o)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Container>
  )
}
