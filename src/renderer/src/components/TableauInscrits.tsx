// TODO: Setup filters: activities, offres, date d'inscription, see #5
// TODO: option pour assurer qu'un inscrit n'est affiché que dans une activité, même s'il est inscrit à plusieurs activités, see #4

import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid'
import { inscritSelected, Offre, selectInscrits } from '../features/inscrits/inscritsSlice'
import { useDispatch, useSelector } from 'react-redux'

export const TableauInscrits = () => {
  const dispatch = useDispatch()
  const inscrits = useSelector(selectInscrits)

  // const columns = [
  //   { title: 'Numero Comiti', field: 'nComiti', width: 100 },
  //   { title: 'Nom', field: 'nom', width: 300 },
  //   { title: 'Créneaux', field: 'offres', width: 400, resizable: true }
  // ]
  const stringOfOffre = (o: Offre) => {
    const sCr = o.creneaux.map((cr) => `${cr.lieu} - ${cr.heure}`).join(', ')
    return `${o.titreCourt} - ${sCr}`
  }
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
  const rowSelectionChanged = (newRowSelectionModel: GridRowSelectionModel) => {
    console.log(newRowSelectionModel)
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
          onRowSelectionModelChange={rowSelectionChanged}
        />
      </div>
    </>
  )
}
