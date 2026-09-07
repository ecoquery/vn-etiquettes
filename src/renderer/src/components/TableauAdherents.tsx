import { Typography } from '@mui/material'
import type { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid'
import { DataGrid } from '@mui/x-data-grid'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch } from '../app/store'
import { selectAdherents } from '../features/adherents/adherentsSlice'
import { selectAliasPiscines } from '../features/configuration/configurationSlice'
import { selectActivites, selectCreneaux } from '../features/creneaux/creneauxSlice'
import { selectDisplayedAdherent, setDisplayAdherent } from '../features/impression/impressionSlice'
import { buildAdherentDisplay, compareAdherentDisplay } from './adherentDisplay'

const TableauAdherents = ({ selectedAdherents }: { selectedAdherents: string[] }) => {
  const dispatch: AppDispatch = useDispatch()
  const activites = useSelector(selectActivites)
  const creneaux = useSelector(selectCreneaux)
  const aliasPiscines = useSelector(selectAliasPiscines)
  const adherents = useSelector(selectAdherents)
  // console.log(adherents)
  // console.log(selectedAdherents)
  const data = selectedAdherents
    .map((n) => {
      return adherents[n]
    })
    .filter(Boolean)
    .map(buildAdherentDisplay(creneaux, activites, aliasPiscines))
    .toSorted(compareAdherentDisplay)
  const displayedAdherent = useSelector(selectDisplayedAdherent)

  const columns: GridColDef<(typeof data)[number]>[] = [
    {
      field: 'id',
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
      valueFormatter: (cr: string[]) => cr.join(', '),
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
    ids: new Set(displayedAdherent ? [displayedAdherent.id] : [])
  }

  const rowSelectionChanged = (newRowSelectionModel: GridRowSelectionModel) => {
    const nom = newRowSelectionModel.ids.values().next().value
    const adherent = adherents[nom ?? '']
    // console.log('new selection: ', adherent, ' from ', nom)
    dispatch(
      setDisplayAdherent(
        adherent ? buildAdherentDisplay(creneaux, activites, aliasPiscines)(adherent) : undefined
      )
    )
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
          getRowId={(row) => row.id || ''}
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
