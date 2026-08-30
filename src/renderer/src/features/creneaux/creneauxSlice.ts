import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AppDispatch, AppThunk, RootState } from '@renderer/app/store'

/** Clé avec laquelle les données sont stockées dans le localStorage de
 * l'application. */
const creneauxLocalStorageKey = 'creneaux'

/** Une activité correspond à un type de créneau, ce qui correspond en général à
 * un type d'adhérent. */
export interface Activite {
  nom: string
}

/** Un créneau est une session (parfois juste une catégorie comme dans le cas
 * des compétiteurs). Il est rattaché à une activité. */
export interface Creneau {
  nom: string
  activite: Activite
  debut?: string
  fin?: string
  lieu?: string
  jour?: string
}

/**
 * Les informations sur l'ensemble des créneaux et des activités.
 */
export interface CreneauxState {
  activites: Record<string, Activite>
  creneaux: Record<string, Creneau>
}

/** Données fictives */
const initialActivites = { 'Activité Test': { nom: 'Activité Test' } }
/** Données fictives */
const initialCreneaux = {
  'Créneau Test': { nom: 'Créneau Test', activite: initialActivites['Activité Test'] }
}

const initialState: CreneauxState = {
  activites: initialActivites,
  creneaux: initialCreneaux
}

export const creneauxSlice = createSlice({
  name: 'creneaux',
  initialState,
  reducers: {
    updateCreneauxData: (state, action: PayloadAction<CreneauxState>) => {
      Object.assign(state, action.payload)
    }
  }
})

/**
 * Sauvegarde les informations des créneaux et
 * des activités dans le localstorage.
 * @param _dispatch inutilisé
 * @param getState pour accéder à l'état global
 */
const saveCreneaux: AppThunk = (_dispatch, getState) => {
  localStorage.setItem(creneauxLocalStorageKey, JSON.stringify(getState().creneaux))
}

/**
 * Charge les données des créneaux depuis le localStorage.
 * @param dispatch pour décclencher la mise à jour de l'état
 * @param _getState inutilisé
 */
export const loadCreneaux: AppThunk = (dispatch, _getState) => {
  const jsonData = localStorage.getItem(creneauxLocalStorageKey)
  const creneauxData = JSON.parse(jsonData ?? JSON.stringify(initialState)) as CreneauxState
  dispatch(creneauxSlice.actions.updateCreneauxData(creneauxData))
}

/**
 * Construit les données des créneaux à partir du fichier d'import
 * @param rows lignes du fichier csv importé
 */
export const importCreneauxWithData =
  (rows: Array<Record<string, string>>) => (dispatch: AppDispatch, getState: () => RootState) => {
    const activites: Record<string, Activite> = {}
    const creneaux: Record<string, Creneau> = {}
    const hd = getState().configuration.headersMonClub
    for (const row of rows) {
      const nomCreneau = row[hd.cNomCreneau]
      const nomActivite = row[hd.cNomActivite]
      if (!(nomActivite in activites)) {
        activites[nomActivite] = { nom: nomActivite }
      }
      const activite = activites[nomActivite]
      if (nomCreneau) {
        creneaux[nomCreneau] = { nom: nomCreneau, activite }
      }
    }
    dispatch(creneauxSlice.actions.updateCreneauxData({ activites, creneaux }))
    dispatch(saveCreneaux)
  }

// export const { ....... } = creneauxSlice.actions

export default creneauxSlice.reducer

// Selector functions allows us to select a value from the Redux root state.
// Selectors can also be defined inline in the `useSelector` call
// in a component, or inside the `createSlice.selectors` field.
export const selectActivites = (state: RootState) => state.creneaux.activites
export const selectCreneaux = (state: RootState) => state.creneaux.creneaux
