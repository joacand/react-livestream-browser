import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import * as React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LivestreamBrowser from '../components/LivestreamBrowser';
import { OAuthTwitch } from '../components/OAuthTwitch';
import { Settings } from '../components/Settings';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#d1c4e9',
      contrastText: '#311b92',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#7c4dff',
      paper: '#4527a0',
    },
    text: {
      primary: 'rgba(255,255,255,0.87)',
    },
  },
});

function App(): JSX.Element {
  React.useEffect(() => {
    window.ipcAPI?.rendererReady();
  }, []);

  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LivestreamBrowser />}>
              <Route path="*" />
            </Route>
            <Route path="C:/settings" element={<Settings />} />
            <Route path="C:/oauthTwitch" element={<OAuthTwitch />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </React.StrictMode>
  );
}

export default App;
