import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material'
import type { JSX } from 'react'
import { useState } from 'react'
import ActivitePanel from './components/ActivitePanel'
import { ConfigurationPanel } from './components/ConfigurationPanel'
import { CreneauxPanel } from './components/CreneauxPanel'
import GestionAdherents from './components/GestionAdherents'
import Versions from './components/Versions'

function App(): JSX.Element {
  const navItems = ['impression', 'creneaux', 'activites', 'configuration']
  const [curTab, setCurTab] = useState('impression')

  const tabComponent = (tabItem) => {
    switch (tabItem) {
      case 'impression':
        return (
          <Container style={{ paddingTop: '40px' }}>
            <GestionAdherents />
          </Container>
        )
      case 'creneaux':
        return (
          <Container style={{ paddingTop: '40px' }}>
            <CreneauxPanel />
          </Container>
        )
      case 'activites':
        return (
          <Container style={{ paddingTop: '40px' }}>
            <ActivitePanel />
          </Container>
        )
      case 'configuration':
        return (
          <Container style={{ paddingTop: '40px' }}>
            <ConfigurationPanel />
          </Container>
        )
      default:
        return <p>Erreur: tab non géré</p>
    }
  }

  return (
    <>
      <AppBar position="fixed">
        <Toolbar component="nav">
          <Typography
            variant="h6"
            color="inherit"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            VN: Impression étiquettes
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              <Button
                key={item}
                sx={{ color: '#fff' }}
                onClick={() => {
                  setCurTab(item)
                }}
              >
                {item}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      {tabComponent(curTab)}
      <Versions></Versions>
    </>
  )
}

export default App
