import Versions from './components/Versions'
import { JSX } from 'react'
import { GestionInscrits } from './components/GestionInscrits'
import { GestionImpression } from './components/GestionImpression'
import { AppBar, Container, Grid, Toolbar, Typography } from '@mui/material'
import { ComitiFileHandler } from './components/ComitiFileHandler'
const debugDymo = false

function App({ dymo }): JSX.Element {
  if (debugDymo) {
    if (dymo !== undefined) {
      console.log(dymo)
    } else {
      console.error('dymo is undefined')
    }
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Typography variant="h6" color="inherit" component="div">
            VN: Impression étiquettes
          </Typography>
        </Toolbar>
      </AppBar>
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
      <Versions></Versions>
    </>
  )
}

export default App
