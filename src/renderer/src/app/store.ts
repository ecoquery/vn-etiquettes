import { configureStore, type Action, type ThunkAction } from '@reduxjs/toolkit'
import adherentsReducer from '../features/adherents/adherentsSlice'
import configurationReducer from '../features/configuration/configurationSlice'
import creneauxReducer from '../features/creneaux/creneauxSlice'
import dymoReducer from '../features/dymo/dymoSlice'
import impressionReducer from '../features/impression/impressionSlice'

export const store = configureStore({
  reducer: {
    impression: impressionReducer,
    configuration: configurationReducer,
    dymo: dymoReducer,
    creneaux: creneauxReducer,
    adherents: adherentsReducer
  },
  devTools: true
})

// Infer the type of `store`
export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore['dispatch']
// Define a reusable type describing thunk functions
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>
