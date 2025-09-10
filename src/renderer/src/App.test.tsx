import { render } from '@testing-library/react'
import App from './App'
import { describe, it } from 'vitest'
import { dymo } from './app/Dymo-test'
import { store } from './app/store'
import { Provider } from 'react-redux'

describe('App', () => {
  it('should render properly', () => {
    render(
      <Provider store={store}>
        <App dymo={dymo} />
      </Provider>
    )
  })
})
