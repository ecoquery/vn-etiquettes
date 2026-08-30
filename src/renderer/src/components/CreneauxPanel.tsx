import { Button, Container, Stack, Typography } from '@mui/material'
import type { GridColDef } from '@mui/x-data-grid'
import { DataGrid } from '@mui/x-data-grid'
import type { CSSProperties } from 'react'
import { useCSVReader } from 'react-papaparse'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch } from '../app/store'
import type { Activite } from '../features/creneaux/creneauxSlice'
import { importCreneauxWithData, selectCreneaux } from '../features/creneaux/creneauxSlice'

const styles = {
  csvReader: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
    padding: 10
  } as CSSProperties,
  browseFile: {
    width: '200px',
    margin: 10
  } as CSSProperties,
  acceptedFile: {
    // border: '1px solid #ccc',
    height: 45,
    lineHeight: 2.5,
    paddingLeft: 10,
    width: '500px'
  } as CSSProperties,
  remove: {
    borderRadius: 0,
    padding: '0 20px'
  } as CSSProperties,
  progressBarBackgroundColor: {
    backgroundColor: 'blue'
  } as CSSProperties
}

export const CreneauxPanel = () => {
  const { CSVReader } = useCSVReader()
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
        <CSVReader
          onUploadAccepted={(results: any) => {
            dispatch(importCreneauxWithData(results.data))
          }}
          config={{ header: true }}
        >
          {({ getRootProps, acceptedFile, ProgressBar }: any) => (
            <>
              <div style={styles.csvReader}>
                <Button variant="contained" {...getRootProps()} style={styles.browseFile}>
                  Importer les créneaux
                </Button>
                <div style={styles.acceptedFile}>{acceptedFile?.name}</div>
              </div>
              <ProgressBar style={styles.progressBarBackgroundColor} />
            </>
          )}
        </CSVReader>
      </Stack>
    </Container>
  )
}
