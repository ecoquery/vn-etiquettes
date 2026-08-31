import { Button, Checkbox, Container, Stack, Typography } from '@mui/material'
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { DataGrid } from '@mui/x-data-grid'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch } from '../app/store'
import type { Activite } from '../features/creneaux/creneauxSlice'
import {
  saveCreneaux,
  selectActivites,
  setActiviteSansCarte,
  setActiviteSansSeance
} from '../features/creneaux/creneauxSlice'

const ActivitePanel = () => {
  const dispatch: AppDispatch = useDispatch()
  const activites = useSelector(selectActivites)
  // Données des créneaux sous forme de tableau
  const data = Object.values(activites).filter((a) => a.nom !== undefined)
  const columns: GridColDef<(typeof data)[number]>[] = [
    { field: 'nom', headerName: 'Activité', align: 'left', headerAlign: 'center', width: 300 },
    {
      field: 'sanscarte',
      headerName: 'Sans Carte',
      editable: true,
      type: 'boolean',
      renderCell: (params: GridRenderCellParams) => (
        <Checkbox
          checked={(params.row.sanscarte as boolean) || false}
          onChange={(_evt, value) => {
            dispatch((d) => {
              d(setActiviteSansCarte({ nom: params.row.nom, sanscarte: value }))
              d(saveCreneaux)
            })
          }}
        />
      )
    },
    {
      field: 'sansseance',
      headerName: 'Sans Seance',
      editable: true,
      type: 'boolean',
      renderCell: (params: GridRenderCellParams) => (
        <Checkbox
          checked={(params.row.sansseance as boolean) || false}
          onChange={(_evt, value) => {
            dispatch((d) => {
              d(setActiviteSansSeance({ nom: params.row.nom, sansseance: value }))
              d(saveCreneaux)
            })
          }}
        />
      )
    }
  ]

  return (
    <Container>
      <Stack alignItems={'center'}>
        <Typography variant="h2">Activités</Typography>
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
      </Stack>
    </Container>
  )
}
export default ActivitePanel
