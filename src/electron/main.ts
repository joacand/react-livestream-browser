import { app, BrowserWindow, ipcMain } from 'electron';
import child_process = require('child_process');
import { ElectronJSONSettingsStoreMain } from 'electron-json-settings-store';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const configSchema = {
  twitchClientId: { default: '', type: 'string' },
  twitchAccessToken: { default: '', type: 'string' },
  twitchIdToken: { default: '', type: 'string' },
  twitchUserId: { default: '', type: 'string' },
  twitchUserName: { default: '', type: 'string' },
  streamUtilityPath: { default: 'C:\\Program Files (x86)\\Streamlink\\bin\\streamlink.exe', type: 'string' }
};

const config = new ElectronJSONSettingsStoreMain(configSchema, { watchFile: false, writeBeforeQuit: true });
config.initSync();
console.log("Config location: " + config.getCompleteFilePath);

const ElectronApp = {
  mainWindow: null as Electron.BrowserWindow,

  init(): void {
    console.log("init startred");

    if (require('electron-squirrel-startup')) {
      app.quit();
    }

    app.on('ready', () => this.onReady());

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', () => this.onActivate());
  },

  installIpcMainListeners() {
    console.log('Install ipcMain Listeners');

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
  },

  async onReady(): Promise<void> {
    console.log("onReady called");
    this.installIpcMainListeners();
    await this.createWindow();
  },

  async onActivate(): Promise<void> {
    console.log("onActivate called");

    if (BrowserWindow.getAllWindows().length === 0) {
      await this.createWindow();
    }
  },

  async createWindow(): Promise<void> {
    console.log("Creating main window");

    this.mainWindow = new BrowserWindow({
      height: 1000,
      width: 1400,
      webPreferences: {
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      },
      icon: `${__dirname}/../assets/livestreambrowsericon.png`,
    });
    this.mainWindow.removeMenu();

    this.mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    this.mainWindow.webContents.openDevTools();
  },
}

console.log(`Electron version: ${app.getVersion()}`);
ElectronApp.init();
