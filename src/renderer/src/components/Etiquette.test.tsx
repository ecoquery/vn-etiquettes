import { render } from '@testing-library/react'
import Etiquette from './Etiquette'
import { describe, it } from 'vitest'
import { testWithDymo } from '../app/Dymo-test'

describe('Etiquette', () => {
  testWithDymo('Renders properly with dymo', ({ dymo }) => {
    render(
      <Etiquette
        etiquetteData={{ nom: 'test-nom', creneaux: 'crenaux-test', annee: 'annee-test' }}
        dymo={dymo}
      />
    )
  })
})
