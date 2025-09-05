import { render } from '@testing-library/react'
import App from './App'
import { describe, it } from 'vitest'
import { dymo } from './app/Dymo-test'

describe('App', () => {
  it('should render properly', () => {
    render(<App dymo={dymo} />)
  })
})
