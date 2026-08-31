import { Container, Stack, Typography } from '@mui/material'
import type { GridColDef } from '@mui/x-data-grid'
import { DataGrid } from '@mui/x-data-grid'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch } from '../app/store'
import type { Activite } from '../features/creneaux/creneauxSlice'
import { importCreneauxWithData, selectCreneaux } from '../features/creneaux/creneauxSlice'
import SheetReader from './SheetReader'

export const CreneauxPanel = () => {
  const dispatch: AppDispatch = useDispatch()
  const creneaux = useSelector(selectCreneaux)
  // Données des créneaux sous forme de tableau
  const data = Object.values(creneaux)
  const columns: GridColDef<(typeof data)[number]>[] = [
    { field: 'nom', headerName: 'Créneau', align: 'left', headerAlign: 'center' },
    { field: 'activite', headerName: 'Activité', valueFormatter: (act: Activite) => act.nom }
  ]
  return (
    <Container>
      <Stack alignItems={'center'}>
        <Typography variant="h2">Créneaux</Typography>
        <div style={{ height: 500, width: '100%' }}>
          <DataGrid
            // apiRef={apiRef}
            // initialState={{ sorting: { sortModel: defaultSortModelInGrid } }}
            columns={columns}
            rows={data}
            getRowId={(row) => row.nom}
            // rowSelectionModel={rowSelectionModel}
            // onRowSelectionModelChange={rowSelectionChanged}
            // onSortModelChange={sortModelUpdated}
            // paginationModel={paginationModel}
            // onPaginationModelChange={setPaginationModel}
          />
        </div>
        <SheetReader
          onDataLoaded={(data) => {
            dispatch(importCreneauxWithData(data))
          }}
        />
      </Stack>
    </Container>
  )
}
