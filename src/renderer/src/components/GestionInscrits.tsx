import { Stack } from '@mui/material'
import { TableauInscrits } from './TableauInscrits'
import SelecteurGroupes from './SelecteurGroupes'

export const GestionInscrits = () => {
  return (
    <Stack alignItems="center" alignContent={'center'}>
      <SelecteurGroupes />
      <TableauInscrits />
    </Stack>
  )
}
