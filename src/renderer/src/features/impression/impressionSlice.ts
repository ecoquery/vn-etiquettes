import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { compareInscrit, Inscrit, inscritSelected, inscritsFilter } from '../inscrits/inscritsSlice'
import { genereLabelContent } from '../../app/Dymo'
import { formatOffres } from '../../components/Etiquette'
import { AppThunk, RootState } from '@renderer/app/store'

const PRINT_DELAY = 2000

/**
 * Imprime l'étiquette d'un inscrit
 * @param dymo le backend d'impression
 * @param inscrit l'inscrit dont on veut imprimer l'étiquette
 * @param saison la saison courante
 */
export const print = async (dymo, inscrit: Inscrit, saison: string) => {
  const labelData = genereLabelContent(inscrit.nom, formatOffres(inscrit.offres), saison)
  const label = dymo.openLabelXml(labelData)
  label.print()
}

/**
 * Déclenche l'impression des impressions restantes dans la file
 * @param dymo le backend d'impression
 * @param saison la saison courante
 * @returns un thunk qui imprime les impression restantes
 */
const printQueue = (dymo, saison) => async (dispatch, getState: () => RootState) => {
  if (getState().impression.stopImpression) {
    dispatch(inscritSelected(getState().impression.toSelectAfterPrint))
    dispatch(resetPrints())
  } else {
    const inscrit = getState().impression.impressionQueue[getState().impression.idxImpression]
    if (inscrit !== undefined) {
      dispatch(inscritSelected(inscrit))
      if (getState().impression.simulatePrint) {
        console.log(`Simule l'impression de `, inscrit)
      } else {
        await print(dymo, inscrit, saison)
      }
      await new Promise((resolve) => setTimeout(() => resolve(1), PRINT_DELAY))
      dispatch(nextPrint())
      dispatch(
        inscritSelected(getState().impression.impressionQueue[getState().impression.idxImpression])
      )
      dispatch(printQueue(dymo, saison))
    }
  }
}

/**
 *
 * @param state l'état de l'application
 * @param nbToPrint le nombre d'impressions à effectuer
 * @returns le tableau des inscrits à imprimer
 */
export const makeInscritsToPrint = (state: RootState, nbToPrint: number) => {
  const inscrits = Object.values(state.inscrits.inscrits)
    .filter(inscritsFilter(state.inscrits.selectedOffre, state.inscrits.selectedActivite))
    .toSorted(compareInscrit(state.inscrits.sortModel))
  const selIdx = inscrits.findIndex((inscr) => state.inscrits.selected?.nComiti === inscr.nComiti)
  const start = Math.max(selIdx, 0)
  const end = Math.min(start + nbToPrint, inscrits.length)
  return { toPrint: inscrits.slice(start, end), afterPrint: inscrits[end] }
}

/**
 * Action déclenchant une impression en batch
 * @param dymo backend d'impression d'étiquettes
 * @param saison saison courante
 * @param nbToPrint nombre d'étiquette à imprimer dans le batch
 * @returns la fonction thunk qui va déclencher l'impression
 */
export const printAll =
  (dymo, saison: string, nbToPrint: number): AppThunk =>
  async (dispatch, getState) => {
    const inscritsToPrint = makeInscritsToPrint(getState(), nbToPrint)
    dispatch(setPrintQueue(inscritsToPrint))
    dispatch(setStopImpression(false))
    dispatch(printQueue(dymo, saison))
  }

/**
 * Application internal state for printing
 */
export interface ImpressionState {
  idxImpression: number
  impressionQueue: Inscrit[]
  stopImpression: boolean
  simulatePrint: boolean
  toSelectAfterPrint?: Inscrit
}

/**
 * État initial pour les impressions
 */
const initialState: ImpressionState = {
  idxImpression: 0,
  impressionQueue: [],
  stopImpression: true,
  simulatePrint: true,
  toSelectAfterPrint: undefined
}

export const impressionSlice = createSlice({
  name: 'impression',
  initialState,
  reducers: {
    nextPrint: (state) => {
      if (!state.stopImpression) {
        state.idxImpression = state.idxImpression + 1
        if (state.idxImpression >= state.impressionQueue.length) {
          state.stopImpression = true
        }
      }
    },
    resetPrints: (state) => {
      state.idxImpression = initialState.idxImpression
      state.impressionQueue = initialState.impressionQueue
      state.stopImpression = true
      state.toSelectAfterPrint = undefined
    },
    setPrintQueue: (
      state,
      action: PayloadAction<{ toPrint: Inscrit[]; afterPrint: Inscrit | undefined }>
    ) => {
      state.idxImpression = 0
      state.impressionQueue = action.payload.toPrint
      state.toSelectAfterPrint = action.payload.afterPrint
    },
    setStopImpression: (state, action: PayloadAction<boolean>) => {
      state.stopImpression = action.payload
    },
    setSimulatePrint: (state, action:PayloadAction<boolean>)=>{
      state.simulatePrint = action.payload
    }
  }
})

export const { nextPrint, resetPrints, setPrintQueue, setStopImpression, setSimulatePrint } =
  impressionSlice.actions
export default impressionSlice.reducer
export const selectIdxImpression = (state: RootState) => state.impression.idxImpression
export const selectImpressionQueue = (state: RootState) => state.impression.impressionQueue
export const selectStopImpression = (state: RootState) => state.impression.stopImpression
