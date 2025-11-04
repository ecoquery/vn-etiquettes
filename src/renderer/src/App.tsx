import Versions from './components/Versions'
import { JSX, useState } from 'react'
import { GestionInscrits } from './components/GestionInscrits'
import { GestionImpression } from './components/GestionImpression'
import { AppBar, Box, Button, Container, Grid, Toolbar, Typography } from '@mui/material'
import { ComitiFileHandler } from './components/ComitiFileHandler'
import { ConfigurationPanel } from './components/ConfigurationPanel'
const debugDymo = false

function App({ dymo }): JSX.Element {
  if (debugDymo) {
    if (dymo !== undefined) {
      console.log(dymo)
    } else {
      console.error('dymo is undefined')
    }
  }
  const navItems = ['impression', 'configuration']
  const [curTab, setCurTab] = useState('impression')

  const tabComponent = (tabItem) => {
    switch (tabItem) {
      case 'impression':
        return (
          <Container style={{ paddingTop: '40px' }}>
            <Grid container spacing={2}>
              <Grid size={8}>
                <GestionInscrits />
              </Grid>
              <Grid size={4}>
                <GestionImpression dymo={dymo} />
              </Grid>
            </Grid>
            <ComitiFileHandler />
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
