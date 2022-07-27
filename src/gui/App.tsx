import * as React from 'react';
import ReactDOM from 'react-dom/client'
import { LivestreamBrowser } from "./components/LivestreamBrowser"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

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

class App {

    constructor() {
        this.init();
    }

    init = async (): Promise<void> => {
        this.renderApp();
    };

    renderApp = async (): Promise<void> => {
        console.log("Render");

        const rootElement = document.getElementById('root');

        const root = ReactDOM.createRoot(rootElement);
        root.render(
            <React.StrictMode>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <LivestreamBrowser />
                </ThemeProvider>
            </React.StrictMode>
        );
    };
}

new App();
