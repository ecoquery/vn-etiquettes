// TODO: Setup filters: activities, offres, date d'inscription, see #5
// TODO: option pour assurer qu'un inscrit n'est affiché que dans une activité, même s'il est inscrit à plusieurs activités, see #4

import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid'
import {
  inscritSelected,
  Offre,
  selectInscrits,
  selectSelected,
  stringOfOffre
} from '../features/inscrits/inscritsSlice'
import { useDispatch, useSelector } from 'react-redux'

export const TableauInscrits = () => {
  const dispatch = useDispatch()
  const inscrits = useSelector(selectInscrits)
  const selectedInscrit = useSelector(selectSelected)

  const data = Object.values(inscrits).map((x) => ({
    ...x,
    offres: x.offres.map(stringOfOffre).join('; ')
  }))
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
    const nComiti = newRowSelectionModel.ids.values().next().value ?? 0
    dispatch(inscritSelected(inscrits[nComiti]))
  }

  return (
    <>
      <p>Le tableau ici</p>
      <div style={{ height: 500, width: '100%' }}>
        <DataGrid
          columns={columns}
          rows={data}
          getRowId={(row) => row.nComiti}
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={rowSelectionChanged}
        />
      </div>
    </>
  )
}
