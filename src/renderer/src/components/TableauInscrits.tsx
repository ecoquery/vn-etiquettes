// TODO: use tabulator via https://tabulator.info/docs/6.3/react#react
// TODO: Setup filters: activities, offres, date d'inscription, see #5
// TODO: option pour assurer qu'un inscrit n'est affiché que dans une activité, même s'il est inscrit à plusieurs activités, see #4

import 'tabulator-tables/dist/css/tabulator.min.css' //import Tabulator stylesheet

import { inscritSelected, Offre, selectInscrits } from '../features/inscrits/inscritsSlice'
import { useDispatch, useSelector } from 'react-redux'
import { ReactTabulator } from 'react-tabulator'

export const TableauInscrits = () => {
  const dispatch = useDispatch()
  const inscrits = useSelector(selectInscrits)

  const columns = [
    { title: 'Numero Comiti', field: 'nComiti', width: 100 },
    { title: 'Nom', field: 'nom', width: 300 },
    { title: 'Créneaux', field: 'offres', width: 400, resizable: true }
  ]
  const stringOfOffre = (o: Offre) => {
    const sCr = o.creneaux.map((cr) => `${cr.lieu} - ${cr.heure}`).join(', ')
    return `${o.titreCourt} - ${sCr}`
  }
  const data = Object.values(inscrits).map((x) => ({
    ...x,
    offres: x.offres.map(stringOfOffre).join('; ')
  }))
  return (
    <ReactTabulator
      data={data}
      columns={columns}
      options={{ maxHeight: 300, layout: 'fitData', selectableRows: 1, index: 'nComiti' }}
      events={{
        rowSelectionChanged: (data, _rows, _selected, _deselect) => {
          const nComiti = data[0]?.nComiti
          dispatch(inscritSelected(inscrits[nComiti]))
        }
      }}
    />
  )
}
