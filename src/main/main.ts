import child_process = require('child_process');
import * as path from 'path';
import * as nodeEnv from '_utils/node-env';
import { setupTitlebar, attachTitlebarToWindow } from 'custom-electron-titlebar/main';
// eslint-disable-next-line import/no-extraneous-dependencies
import { BrowserWindow, app, ipcMain } from 'electron';
import { ElectronJSONSettingsStoreMain } from 'electron-json-settings-store';


const configSchema = {
  twitchClientId: { default: '', type: 'string' },
  twitchAccessToken: { default: '', type: 'string' },
  twitchIdToken: { default: '', type: 'string' },
  twitchUserId: { default: '', type: 'string' },
  twitchUserName: { default: '', type: 'string' },
  streamUtilityPath: { default: 'C:\\Program Files (x86)\\Streamlink\\bin\\streamlink.exe', type: 'string' },
};

const config = new ElectronJSONSettingsStoreMain(configSchema, { watchFile: false, writeBeforeQuit: true });
config.initSync();
console.log(`Config location: ${config.getCompleteFilePath}`);

let mainWindow: Electron.BrowserWindow | undefined;

setupTitlebar();

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 730,
    minHeight: 400,
    width: 1120,
    minWidth: 400,
    titleBarStyle: 'hidden',
    webPreferences: {
      devTools: nodeEnv.dev,
      preload: path.join(__dirname, './preload.bundle.js'),
      webSecurity: nodeEnv.prod,
    },
  });
  mainWindow.removeMenu();

  mainWindow.webContents.on('will-navigate', (e: Event, n: string) => {
    if (n.includes('localhost')) {
      if (!n.includes('#access_token=')) {
        return;
      }
      const splits = n.split('#access_token=')[1].split('&id_token=');
      const accessToken = splits[0];
      const idToken = splits[1].split('&scope=')[0];

      config.set('twitchAccessToken', accessToken);
      config.set('twitchIdToken', idToken);
      config.writeSync();

      e.preventDefault();
      mainWindow.loadFile('index.html').finally(() => { /* no action */ });
    }
  });

  mainWindow.loadFile('index.html').finally(() => { /* no action */ });
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = undefined;
  });

  attachTitlebarToWindow(mainWindow);
}

app.whenReady().then(() => {
  if (nodeEnv.dev || nodeEnv.prod) createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows.length === 0) createWindow();
  });
}).finally(() => { /* no action */ });

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('renderer-ready', () => {
  // eslint-disable-next-line no-console
  console.log('Renderer is ready.');
});

ipcMain.on(
  'openProcess',
  (e: Event, cmd: string): void => {
    console.log(cmd);
    const exec = child_process.exec;
    exec(cmd, (error: child_process.ExecException) => {
      console.log(error);
    }).unref();
  }
);

// eslint-disable-next-line import/prefer-default-export
export const exportedForTests = nodeEnv.test ? { createWindow } : undefined;
