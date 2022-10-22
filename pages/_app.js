import { ThemeProvider } from '@emotion/react'
import { createTheme } from '@mui/material'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {

  // change font to inter
  const theme = createTheme({
    typography:{  
      fontFamily: "'Inter', sans-serif",
    },
    palette: {
      primary: {
        //main should be dark navy blue
        main: '#004080',
      }
    }
  });

  return <ThemeProvider theme={theme}>
    <Component {...pageProps} />
  </ThemeProvider>
}

export default MyApp
