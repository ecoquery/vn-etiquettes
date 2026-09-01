import { Grid, Stack } from '@mui/material'
import type { AppDispatch } from '@renderer/app/store'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { importAdherentsWithData, selectAdherents } from '../features/adherents/adherentsSlice'
import { GestionImpression } from './GestionImpression'
import SelecteurAdherents from './SelecteurAdherents'
import SheetReader from './SheetReader'
import TableauAdherents from './TableauAdherents'

const GestionAdherents = () => {
  const dispatch: AppDispatch = useDispatch()
  const adherents = useSelector(selectAdherents)
  const adherentsVisibles = Object.values(adherents).filter((a) => a.premierCreneau !== undefined)
  const [selectedAdherents, setSelectedAdherents] = useState(adherentsVisibles.map((a) => a.nom))
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
