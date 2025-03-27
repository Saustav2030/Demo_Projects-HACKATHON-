import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import App from './App'

const ThemeWrapper = ({ children }) => {
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');

  const getTheme = (isDark) => createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: {
        main: '#2B2D42',
        light: '#8D99AE',
        dark: '#14151F'
      },
      secondary: {
        main: '#EF233C',
        light: '#FF4D6D',
        dark: '#D90429'
      },
      background: {
        default: isDark ? '#121212' : '#EDF2F4',
        paper: isDark ? '#1E1E1E' : '#FFFFFF'
      }
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Arial", sans-serif',
      h1: {
        fontWeight: 700
      },
      h2: {
        fontWeight: 600
      },
      button: {
        textTransform: 'none'
      }
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 8,
            padding: '8px 16px',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: `0 0 10px ${theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.secondary.main}, 0 0 20px ${theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.secondary.main}`
            }
          })
        }
      },
      MuiTypography: {
        styleOverrides: {
          h1: ({ theme }) => ({
            textShadow: theme.palette.mode === 'dark' ? '0 0 10px rgba(255,255,255,0.5)' : 'none'
          }),
          h2: ({ theme }) => ({
            textShadow: theme.palette.mode === 'dark' ? '0 0 8px rgba(255,255,255,0.4)' : 'none'
          }),
          h3: ({ theme }) => ({
            textShadow: theme.palette.mode === 'dark' ? '0 0 6px rgba(255,255,255,0.3)' : 'none'
          })
        }
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: `0 4px 20px ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
            }
          })
        }
      }
    }
  });

  const [theme, setTheme] = React.useState(getTheme(prefersDarkMode.matches));

  React.useEffect(() => {
    const handler = (e) => setTheme(getTheme(e.matches));
    prefersDarkMode.addListener(handler);
    return () => prefersDarkMode.removeListener(handler);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeWrapper>
        <App />
      </ThemeWrapper>
    </BrowserRouter>
  </React.StrictMode>
)