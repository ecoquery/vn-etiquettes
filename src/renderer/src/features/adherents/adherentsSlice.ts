import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { AppDispatch, AppThunk, RootState } from '../../app/store'
import type { Alias, ConfigState } from '../configuration/configurationSlice'
import type { Creneau } from '../creneaux/creneauxSlice'
import { compareCreneaux } from '../creneaux/creneauxSlice'

const adherentsLocalStorageKey = 'adherents'

export type Statut = 'jamais' | 'modifie' | 'imprime'

export interface Adherent {
  nom: string
  creneaux: Record<string, Creneau>
  statut: Statut
  premierCreneau?: Creneau
}

export function nomSimple(a: Adherent): string {
  return a.nom.split(' - ')[0]
}

/**
 * Teste si deux adhérents ont les mêmes créneaux
 * @param a1 premier adhérent
 * @param a2 second adhérent
 * @returns true si les adhérents ont les mêmes créneaux
 */
function memesCreneaux(a1: Adherent, a2: Adherent): boolean {
  const cr1 = Object.keys(a1.creneaux)
  const cr2 = Object.keys(a2.creneaux)
  if (cr1.length !== cr2.length) {
    return false
  } else {
    for (const c of cr1) {
      if (!cr2.includes(c)) {
        return false
      }
    }
    return true
  }
}

/**
 * Renvoie un adhérent dont le statut à été mis à jour en fonction des anciennes valeur de cet adhérent
 * @param a un adhérent
 * @param oldA l'ancien adhérent
 */
function fusionne(a: Adherent, oldA: Adherent | undefined): Adherent {
  if (oldA === undefined || oldA.statut === 'jamais') {
    return { ...a, statut: 'jamais' }
  } else if (oldA.statut === 'modifie' || !memesCreneaux(a, oldA)) {
    return { ...a, statut: 'modifie' }
  } else {
    return { ...a, statut: oldA.statut }
  }
}

export function compareAdherents(a1: Adherent, a2: Adherent): number {
  return a1.nom.localeCompare(a2.nom)
}

export interface AdherentsState {
  adherents: Record<string, Adherent>
}

const initialState: AdherentsState = {
  adherents: { 'Nom test': { nom: 'Nom test', creneaux: {}, statut: 'jamais' } }
}

export const adherentsSlice = createSlice({
  name: 'adherents',
  initialState,
  reducers: {
    updateAdherentsData: (state, action: PayloadAction<AdherentsState>) => {
      Object.assign(state, action.payload)
    },
    setStatut: (state, action: PayloadAction<{ nom: string; statut: Statut }>) => {
      const nom = action.payload.nom
      if (nom in state.adherents) {
        state.adherents[nom].statut = action.payload.statut
      } else {
        console.log("Erreur, l'adhérent n'a pas été trouvé: ", nom)
      }
    },
    setPremierCreneau: (
      state,
      action: PayloadAction<{ nom: string; premierCreneau: Creneau | undefined }>
    ) => {
      const nom = action.payload.nom
      if (nom in state.adherents) {
        state.adherents[nom].premierCreneau = action.payload.premierCreneau
      } else {
        console.log("Erreur, l'adhérent n'a pas été trouvé: ", nom)
      }
    }
  }
})

/**
 * Sauvegarde les informations des adhérents dans le localstorage.
 * @param _dispatch inutilisé
 * @param getState pour accéder à l'état global
 */
export const saveAdherents: AppThunk = (_dispatch, getState) => {
  console.log('Save adhérents')
  localStorage.setItem(adherentsLocalStorageKey, JSON.stringify(getState().adherents))
}

/**
 * Charge les données des adhérents depuis le localStorage.
 * @param dispatch pour décclencher la mise à jour de l'état
 * @param _getState inutilisé
 */
export const loadAdherents: AppThunk = (dispatch, _getState) => {
  const jsonData = localStorage.getItem(adherentsLocalStorageKey)
  const adherentsData = JSON.parse(jsonData ?? JSON.stringify(initialState)) as AdherentsState
  dispatch(adherentsSlice.actions.updateAdherentsData(adherentsData))
}

/**
 * Vide les adhérents de l'application
 * @param dispatch pour déclencher la mise à jour de l'état
 * @param _getState inutilisé
 */
export const viderAdherents: AppThunk = (dispatch, _getState) => {
  dispatch(adherentsSlice.actions.updateAdherentsData({ adherents: {} }))
  dispatch(saveAdherents)
}

const creneauAfficheable = (aliasPiscines: Record<string, Alias>) => (c: Creneau) =>
  !aliasPiscines[c.lieu ?? '']?.ignore

function getPremierCreneau(
  cr: Record<string, Creneau>,
  aliasPiscines: Record<string, Alias>
): Creneau | undefined {
  return Object.values(cr).filter(creneauAfficheable(aliasPiscines)).toSorted(compareCreneaux)[0]
}

/**
 * Construit un adhérent à partir des données d'une ligne
 * @param row la ligne du fichier d'import
 * @param cr les créneaux de l'application
 * @param config la configuration de l'application
 * @returns l'adhérent de la ligne
 */
function adherentOfLigne(
  row: Record<string, string>,
  cr: Record<string, Creneau>,
  config: ConfigState
): Adherent {
  const h = config.headersMonClub
  const nom = row[h.cNomAdherent]
  const creneaux: Record<string, Creneau> = {}
  for (const c in cr) {
    if (c in row && row[c]) {
      creneaux[c] = cr[c]
    }
  }
  const premierCreneau = getPremierCreneau(creneaux, config.aliasPiscines)
  const statut: Statut = 'jamais'
  return { nom, creneaux, statut, premierCreneau }
}

/**
 * Reconstruit les données calculées chez les adhérents, i.e.
 * - le premier créneau
 */
export const recomputeAdherentDerivedData = (dispatch: AppDispatch, getState: () => RootState) => {
  console.log('recompteAdherentData triggered')
  const adherents = getState().adherents.adherents
  const aliasPiscines = getState().configuration.aliasPiscines
  for (const adherent of Object.values(adherents)) {
    dispatch(setPremierCreneau({nom:adherent.nom, premierCreneau:getPremierCreneau(adherent.creneaux,aliasPiscines)}))
  }
  dispatch(saveAdherents)
}

/**
 * Construit les données des adhérents à partir du fichier d'import. Le statut
 * des adhérents est calculé à partir des données éventuellement présentes dans
 * l'état courant.
 * @param rows lignes du fichier d'import
 */
export const importAdherentsWithData =
  (rows: Record<string, string>[]) => (dispatch: AppDispatch, getState: () => RootState) => {
    const previousAdherents = getState().adherents.adherents
    const creneaux = getState().creneaux.creneaux
    const config = getState().configuration
    console.log('Importation adhérents')
    const adherents: Record<string, Adherent> = { ...previousAdherents }
    for (const row of rows) {
      const adherent = adherentOfLigne(row, creneaux, config)
      if (adherent.nom) {
        adherents[adherent.nom] = fusionne(adherent, adherents[adherent.nom])
      }
    }
    dispatch(adherentsSlice.actions.updateAdherentsData({ adherents }))
    dispatch(saveAdherents)
  }

export default adherentsSlice.reducer

export const { setStatut, setPremierCreneau } = adherentsSlice.actions

// Selector functions allows us to select a value from the Redux root state.
// Selectors can also be defined inline in the `useSelector` call
// in a component, or inside the `createSlice.selectors` field.
export const selectAdherents = (state: RootState) => state.adherents.adherents
