import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { dymo, genereLabelContent } from '../../app/Dymo'
import type { AppThunk, RootState } from '../../app/store'
import {
  type AdherentDisplay,
  buildAdherentDisplay,
  compareAdherentDisplay
} from '../../components/adherentDisplay'

/**
 * Imprime l'étiquette d'un inscrit
 * @param adherent l'inscrit dont on veut imprimer l'étiquette
 * @param saison la saison courante
 */
export const print = async (adherent: AdherentDisplay, saison: string, printer: string) => {
  const labelData = genereLabelContent(adherent.nom, adherent.creneaux.join('\n'), saison)
  await dymo.printLabel(printer, labelData)
}

/**
 * Déclenche l'impression des impressions restantes dans la file
 * @param saison la saison courante
 * @returns un thunk qui imprime les impression restantes
 */
const printQueue = (saison) => async (dispatch, getState: () => RootState) => {
  if (getState().impression.stopImpression) {
    dispatch(setDisplayAdherent(getState().impression.toSelectAfterPrint))
    dispatch(resetPrints())
  } else {
    const adherent = getState().impression.impressionQueue[getState().impression.idxImpression]
    const printer = getState().dymo.defaultPrinter
    if (adherent !== undefined && printer !== undefined) {
      dispatch(setDisplayAdherent(adherent))
      if (getState().configuration.simulatePrint) {
        console.log(`Simule l'impression de `, adherent)
      } else {
        await print(adherent, saison, printer)
      }
      await new Promise((resolve) =>
        setTimeout(() => resolve(1), getState().configuration.printDelay * 1000)
      )
      dispatch(nextPrint())
      dispatch(
        setDisplayAdherent(
          getState().impression.impressionQueue[getState().impression.idxImpression]
        )
      )
      dispatch(printQueue(saison))
    }
  }
}

/**
 *
 * @param state l'état de l'application
 * @param nbToPrint le nombre d'impressions à effectuer
 * @returns le tableau des inscrits à imprimer
 */
export const makeInscritsToPrint = (
  state: RootState,
  selectedAdherentNames: string[],
  nbToPrint: number
) => {
  const adherents = state.adherents.adherents
  const selectedAdherents = selectedAdherentNames
    .map((n) => adherents[n])
    .map(
      buildAdherentDisplay(
        state.creneaux.creneaux,
        state.creneaux.activites,
        state.configuration.aliasPiscines
      )
    )
    .toSorted(compareAdherentDisplay)

  const selIdx = selectedAdherents.findIndex(
    (adh) => state.impression.displayedAdherent?.id === adh.id
  )
  const start = Math.max(selIdx, 0)
  const end = Math.min(start + nbToPrint, selectedAdherents.length)
  return { toPrint: selectedAdherents.slice(start, end), afterPrint: selectedAdherents[end] }
}

/**
 * Action déclenchant une impression en batch
 * @param saison saison courante
 * @param nbToPrint nombre d'étiquette à imprimer dans le batch
 * @returns la fonction thunk qui va déclencher l'impression
 */
export const printAll =
  (saison: string, selectedAdherents: string[], nbToPrint: number): AppThunk =>
  async (dispatch, getState) => {
    const inscritsToPrint = makeInscritsToPrint(getState(), selectedAdherents, nbToPrint)
    dispatch(setPrintQueue(inscritsToPrint))
    dispatch(setStopImpression(false))
    dispatch(printQueue(saison))
  }

/**
 * Application internal state for printing
 */
export interface ImpressionState {
  idxImpression: number
  impressionQueue: AdherentDisplay[]
  stopImpression: boolean
  toSelectAfterPrint?: AdherentDisplay
  displayedAdherent?: AdherentDisplay
}

/**
 * État initial pour les impressions
 */
const initialState: ImpressionState = {
  idxImpression: 0,
  impressionQueue: [],
  stopImpression: true,
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
      action: PayloadAction<{ toPrint: AdherentDisplay[]; afterPrint: AdherentDisplay | undefined }>
    ) => {
      state.idxImpression = 0
      state.impressionQueue = action.payload.toPrint
      state.toSelectAfterPrint = action.payload.afterPrint
    },
    setStopImpression: (state, action: PayloadAction<boolean>) => {
      state.stopImpression = action.payload
    },
    setDisplayAdherent: (state, action: PayloadAction<AdherentDisplay | undefined>) => {
      state.displayedAdherent = action.payload
    }
  }
})

export const { nextPrint, resetPrints, setPrintQueue, setStopImpression, setDisplayAdherent } =
  impressionSlice.actions
export default impressionSlice.reducer
export const selectIdxImpression = (state: RootState) => state.impression.idxImpression
export const selectImpressionQueue = (state: RootState) => state.impression.impressionQueue
export const selectStopImpression = (state: RootState) => state.impression.stopImpression
export const selectDisplayedAdherent = (state: RootState) => state.impression.displayedAdherent
