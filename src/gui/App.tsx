import * as React from 'react';
import ReactDOM from 'react-dom/client'
import { LivestreamBrowser } from "./LivestreamBrowser"

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
                <LivestreamBrowser />
            </React.StrictMode>
        );
    };
}

new App();
