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
      main: '#383838',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#212121',
    },
    background: {
      default: '#1e1e1e',
      paper: '#212121',
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
