import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk, RootState } from '@renderer/app/store'
import Dymo from 'dymo-connect'
import { Printer } from 'dymo-connect/dist/types'

const dymo = new Dymo()

/**
 * Application internal state for handling dymo service
 */
export interface DymoState {
  defaultPrinter: string | undefined
}

/** Initial state */
const initialState: DymoState = {
  defaultPrinter: undefined
}

/** Redux slice */
export const dymoSlice = createSlice({
  name: 'dymo',
  initialState,
  reducers: {
    updateDefaultPrinter: (state, action: PayloadAction<string | undefined>) => {
      state.defaultPrinter = action.payload
    }
  }
})

/** Thunk for loading printers from service */
export const updatePrinters: AppThunk<Promise<void>> = async (dispatch, _getState) => {
  try {
    const printersAnswer = await dymo.getPrinters()
    if (printersAnswer.success) {
      const printers = printersAnswer.data as Printer[]
      dispatch(dymoSlice.actions.updateDefaultPrinter(printers[0]?.name))
    } else {
      console.error(printersAnswer.data)
      dispatch(dymoSlice.actions.updateDefaultPrinter(undefined))
    }
  } catch (e) {
    console.error(e)
    dispatch(dymoSlice.actions.updateDefaultPrinter(undefined))
  }
}

export default dymoSlice.reducer
export const selectDefaultPrinter = (state: RootState) => state.dymo.defaultPrinter
