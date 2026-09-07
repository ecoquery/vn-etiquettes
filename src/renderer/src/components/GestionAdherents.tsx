import { Grid, Stack } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch } from '../app/store'
import { importAdherentsWithData, selectAdherents } from '../features/adherents/adherentsSlice'
import { selectAliasPiscines } from '../features/configuration/configurationSlice'
import { selectActivites, selectCreneaux } from '../features/creneaux/creneauxSlice'
import { buildAdherentDisplay, compareAdherentDisplay } from './adherentDisplay'
import { GestionImpression } from './GestionImpression'
import SelecteurAdherents from './SelecteurAdherents'
import SheetReader from './SheetReader'
import TableauAdherents from './TableauAdherents'

const GestionAdherents = () => {
  const dispatch: AppDispatch = useDispatch()
  const adherents = useSelector(selectAdherents)
  const creneaux = useSelector(selectCreneaux)
  const activites = useSelector(selectActivites)
  const aliasPiscines = useSelector(selectAliasPiscines)

  console.log('Refreshed GestionAdherents', adherents)

  const adherentsVisibles = Object.values(adherents)
    .map(buildAdherentDisplay(creneaux, activites, aliasPiscines))
    .filter((a) => a.affiche)
    .toSorted(compareAdherentDisplay)
  const [selectedAdherents, setSelectedAdherents] = useState(adherentsVisibles.map((a) => a.id))

  useEffect(() => {
    setSelectedAdherents(adherentsVisibles.map((a) => a.id))
  }, [adherents])

  return (
    <Grid container spacing={2}>
      <Grid size={8}>
        <Stack>
          <SelecteurAdherents onSelectionChange={setSelectedAdherents} />
          <TableauAdherents selectedAdherents={selectedAdherents} />
          <Stack direction={'row'} spacing={2}>
            <SheetReader onDataLoaded={(data) => dispatch(importAdherentsWithData(data))} />
          </Stack>
        </Stack>
      </Grid>
      <Grid size={4}>
        <GestionImpression selectedAdherents={selectedAdherents} />
      </Grid>
    </Grid>
  )
}
export default GestionAdherents
