import { Stack } from '@mui/material'
import { ComitiFileHandler } from './ComitiFileHandler'
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
