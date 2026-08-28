import { render } from '@testing-library/react'
import Etiquette from './Etiquette'
import { describe, expect, it, test } from 'vitest'
import { Provider } from 'react-redux'
import { store } from '../app/store'

describe('Etiquette', () => {
  test('Renders properly with dymo', () => {
    const result = render(
      <Provider store={store}>
        <Etiquette saison="2025-2026" />
      </Provider>
    )
    expect(result?.baseElement).toBeDefined()
  })
})
