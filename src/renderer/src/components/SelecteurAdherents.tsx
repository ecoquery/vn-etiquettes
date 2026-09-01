import type { SelectChangeEvent } from '@mui/material'
import { FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { type Adherent, selectAdherents } from '../features/adherents/adherentsSlice'
import {
  compareActivite,
  compareCreneaux,
  selectActivites,
  selectCreneaux
} from '../features/creneaux/creneauxSlice'

const toutes = 'toutes'
const tous = 'tous'

const SelecteurAdherents = ({
  onSelectionChange
}: {
  onSelectionChange: (newSelection: string[]) => void
}) => {
  const activites = useSelector(selectActivites)
  const creneaux = useSelector(selectCreneaux)
  const adherents = useSelector(selectAdherents)
  const [selectedActivite, setSelectedActivite] = useState(toutes)
  const [selectedCreneau, setSelectedCreneau] = useState(tous)
  const activitesArray = Object.values(activites).toSorted(compareActivite)
  const creneauxArray = Object.values(creneaux)
    .toSorted(compareCreneaux)
    .filter((c) => selectedActivite === toutes || c.activite.nom === selectedActivite)

  const filterAdherents = (nomActivite, nomCreneau) => (a: Adherent) => {
    if (nomCreneau === tous) {
      if (nomActivite === toutes) {
        return true
      } else {
        return nomActivite === a.premierCreneau?.activite.nom
      }
    } else {
      return nomCreneau === a.premierCreneau?.nom
    }
  }

  const handleActiviteChange = (event: SelectChangeEvent) => {
    const value = event.target.value
    setSelectedActivite(value)
    let nomCreneau = selectedCreneau
    if (
      value === toutes ||
      (selectedCreneau !== tous &&
        creneaux[selectedCreneau]?.activite?.nom !== activites[value]?.nom)
    ) {
      setSelectedCreneau(tous)
      nomCreneau = tous
    }
    onSelectionChange(
      Object.values(adherents)
        .filter(filterAdherents(value, nomCreneau))
        .map((a) => a.nom)
    )
  }

  const handleCreneauChange = (event: SelectChangeEvent) => {
    const value = event.target.value
    setSelectedCreneau(value)
    let nomActivite = selectedActivite
    if (value !== tous) {
      nomActivite = creneaux[value].activite.nom
      setSelectedActivite(nomActivite)
    }
    onSelectionChange(
      Object.values(adherents)
        .filter(filterAdherents(nomActivite, value))
        .map((a) => a.nom)
    )
  }

  return (
    <Stack direction="row" spacing={2}>
      <FormControl>
        <InputLabel id="activite-select-label">Activité</InputLabel>
        <Select
          labelId="activite-select-label"
          id="activite-simple-select"
          value={selectedActivite ?? toutes}
          label="Activité"
          onChange={handleActiviteChange}
        >
          <MenuItem value={toutes}>Toutes</MenuItem>
          {activitesArray.map((activite) => (
            <MenuItem key={activite.nom} value={activite.nom}>
              {activite.nom}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel id="creneau-select-label">Créneau</InputLabel>
        <Select
          labelId="creneau-select-label2"
          id="creneau-simple-select"
          value={selectedCreneau ?? tous}
          label="Créneau"
          onChange={handleCreneauChange}
        >
          <MenuItem value={tous}>Tous</MenuItem>
          {creneauxArray.map((c) => (
            <MenuItem key={c.nom} value={c.nom}>
              {c.nom}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
        <DatePicker
          label="Inscrits à partir du"
          value={dateInscritApres}
          onChange={(newValue) => {
            dispatch(inscritApresSelected(newValue?.toISOString()))
          }}
        />
      </LocalizationProvider>
      <Button
        variant="contained"
        onClick={() => {
          dispatch(inscritApresSelected(undefined))
        }}
      >
        Raz date
      </Button> */}
    </Stack>
  )
}
export default SelecteurAdherents
