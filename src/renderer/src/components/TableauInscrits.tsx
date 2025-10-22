// TODO: Setup filters: date d'inscription, see #5

import {
  DataGrid,
  GridCallbackDetails,
  GridColDef,
  GridRowSelectionModel,
  GridSortModel,
  useGridApiRef
} from '@mui/x-data-grid'
import {
  compareInscrit,
  defaultSortModel,
  inscritSelected,
  inscritsFilter,
  selectInscrits,
  selectSelected,
  selectSelectedActivite,
  selectSelectedOffre,
  selectSortModel,
  sortModelChanged,
  stringOfOffre
} from '../features/inscrits/inscritsSlice'
import { useDispatch, useSelector } from 'react-redux'
import React from 'react'

const defaultSortModelInGrid = [defaultSortModel]

export const TableauInscrits = () => {
  const dispatch = useDispatch()
  const apiRef = useGridApiRef()
  const inscrits = useSelector(selectInscrits)
  const selectedInscrit = useSelector(selectSelected)
  const selectedActivite = useSelector(selectSelectedActivite)
  const selectedOffre = useSelector(selectSelectedOffre)
  const sortModel = useSelector(selectSortModel)
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 100,
    page: 0
  })
  const [userSelection, setUserSelection] = React.useState<number | undefined>(undefined)

  const data = Object.values(inscrits)
    .filter(inscritsFilter(selectedOffre, selectedActivite))
    .toSorted(compareInscrit(sortModel))
    .map((x) => ({
      ...x,
      offres: x.offres.map(stringOfOffre).join('; ')
    }))

  const rowIndex = data.findIndex((row) => row.nComiti === selectedInscrit?.nComiti)

  const columns: GridColDef<(typeof data)[number]>[] = [
    {
      field: 'nComiti',
      headerName: 'Numero Comiti',
      width: 120,
      align: 'center',
      headerAlign: 'center'
    },
    { headerName: 'Nom', field: 'nom', flex: 2 },
    { headerName: 'Créneaux', field: 'offres', flex: 3 }
  ]

  const rowSelectionModel: GridRowSelectionModel = {
    type: 'include',
    ids: new Set(selectedInscrit ? [selectedInscrit.nComiti] : [])
  }

  const rowSelectionChanged = (newRowSelectionModel: GridRowSelectionModel) => {
    const nComiti: number = (newRowSelectionModel.ids.values().next().value ?? 0) as number
    setUserSelection(nComiti)
    dispatch(inscritSelected(inscrits[nComiti]))
  }

  const sortModelUpdated = (model: GridSortModel, _details: GridCallbackDetails) => {
    if (model.length > 0) {
      dispatch(sortModelChanged(model[0]))
    } else {
      dispatch(sortModelChanged(defaultSortModel))
    }
  }

  if (selectedInscrit !== undefined) {
    if (rowIndex !== -1) {
      if (userSelection !== selectedInscrit.nComiti) {
        const expectedPage = Math.floor(rowIndex / paginationModel.pageSize)
        if (expectedPage != paginationModel.page) {
          console.log(`changing page ${paginationModel.page} to ${expectedPage}`)
          setPaginationModel({ ...paginationModel, page: expectedPage })
        }
        setUserSelection(selectedInscrit.nComiti)
        console.log('do scrolling to ', rowIndex)
        apiRef.current?.scrollToIndexes({ rowIndex })
      }
    }
  }

  return (
    <>
      <p>Le tableau ici</p>
      <div style={{ height: 500, width: '100%' }}>
        <DataGrid
          apiRef={apiRef}
          initialState={{ sorting: { sortModel: defaultSortModelInGrid } }}
          columns={columns}
          rows={data}
          getRowId={(row) => row.nComiti}
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={rowSelectionChanged}
          onSortModelChange={sortModelUpdated}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </div>
    </>
  )
}
