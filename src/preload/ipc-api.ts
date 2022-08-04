// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcRenderer } from 'electron';
import { ElectronJSONSettingsStoreRenderer } from 'electron-json-settings-store';
import { Config } from '../core/Config'

const config = new ElectronJSONSettingsStoreRenderer();
config.initSync();
console.log(config.getAll);

const validChannels: string[] = ['openProcess'];

function rendererReady() {
  ipcRenderer.send('renderer-ready');
}

const api: any = {
  send: (channel: string, data: string) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  getConfig: () => config.getAll as Config,
  setConfig: (newConfig: Config) => config.setAndWriteSync(newConfig),
};

export default { rendererReady, api };
