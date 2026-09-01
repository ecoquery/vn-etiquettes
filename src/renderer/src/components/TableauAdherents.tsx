import { Typography } from '@mui/material'
import type { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid'
import { DataGrid } from '@mui/x-data-grid'
import {
  selectDisplayedAdherent,
  setDisplayAdherent
} from '@renderer/features/impression/impressionSlice'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch } from '../app/store'
import { compareAdherents, selectAdherents } from '../features/adherents/adherentsSlice'
import type { Creneau } from '../features/creneaux/creneauxSlice'
import { compareCreneaux } from '../features/creneaux/creneauxSlice'

const TableauAdherents = ({ selectedAdherents }: { selectedAdherents: string[] }) => {
  const dispatch: AppDispatch = useDispatch()
  const adherents = useSelector(selectAdherents)
  const data = selectedAdherents
    .map((n) => {
      return adherents[n]
    })
    .toSorted(compareAdherents)
  const displayedAdherent = useSelector(selectDisplayedAdherent)
  const creneauDisplay = (c: Creneau) => `${c.jour} ${c.debut} - ${c.lieu}`
  const creneauxDisplay = (cr: Record<string, Creneau>) =>
    Object.values(cr).toSorted(compareCreneaux).map(creneauDisplay).join(', ')

  const columns: GridColDef<(typeof data)[number]>[] = [
    {
      field: 'nom',
      headerName: 'Adhérent',
      align: 'left',
      headerAlign: 'center',
      width: 300,
      disableColumnMenu: true,
      sortable: false
    },
    {
      field: 'creneaux',
      headerName: 'Créneaux',
      valueFormatter: creneauxDisplay,
      width: 500,
      sortable: false
    }
    // {
    //   field: 'activite',
    //   headerName: 'Activité',
    //   valueFormatter: (act: Activite) => act.nom,
    //   width: 300
    // },
    // { field: 'jour', headerName: 'Jour' },
    // { field: 'debut', headerName: 'Heure' },
    // { field: 'lieu', headerName: 'Piscine' }
  ]

  const rowSelectionModel: GridRowSelectionModel = {
    type: 'include',
    ids: new Set(displayedAdherent ? [displayedAdherent.nom] : [])
  }

  const rowSelectionChanged = (newRowSelectionModel: GridRowSelectionModel) => {
    const nom = newRowSelectionModel.ids.values().next().value
    // setUserSelection(nComiti)
    dispatch(setDisplayAdherent(adherents[nom ?? '']))
  }

  // gestion du tri
  // const sortModelUpdated = (model: GridSortModel, _details: GridCallbackDetails) => {
  //   if (model.length > 0) {
  //     dispatch(sortModelChanged(model[0]))
  //   } else {
  //     dispatch(sortModelChanged(defaultSortModel))
  //   }
  // }

  // gestion de la pagination
  // if (
  //   selectedInscrit !== undefined &&
  //   rowIndex !== -1 &&
  //   userSelection !== selectedInscrit.nComiti
  // ) {
  //   const expectedPage = Math.floor(rowIndex / paginationModel.pageSize)
  //   if (expectedPage != paginationModel.page) {
  //     setPaginationModel({ ...paginationModel, page: expectedPage })
  //   }
  //   setUserSelection(selectedInscrit.nComiti)
  //   apiRef.current?.scrollToIndexes({ rowIndex })
  // }

  return (
    <>
      <Typography>Adhérents</Typography>
      <div style={{ height: 500, width: '100%' }}>
        <DataGrid
          // apiRef={apiRef}
          // initialState={{ sorting: { sortModel: defaultSortModelInGrid } }}
          columns={columns}
          rows={data}
          getRowId={(row) => row.nom || ''}
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={rowSelectionChanged}
          // onSortModelChange={sortModelUpdated}
          // paginationModel={paginationModel}
          // onPaginationModelChange={setPaginationModel}
        />
      </div>
    </>
  )
}
export default TableauAdherents
