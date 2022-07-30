import { contextBridge, ipcRenderer } from 'electron';
import { ElectronJSONSettingsStoreRenderer } from 'electron-json-settings-store';
import { Config } from './core/Config'

const config = new ElectronJSONSettingsStoreRenderer();
config.initSync();
console.log(config.getAll);

const apiKey = 'api';

const validChannels: string[] = ["openProcess"];

const api: any = {
    send: (channel: string, data: string) => {
        if (validChannels.includes(channel)) {
            return ipcRenderer.send(channel, data);
        }
    },
    getConfig: () => {
        return config.getAll as Config;
    },
    setConfig: (newConfig: Config) => {
        return config.setAndWriteSync(newConfig);
    }
};


contextBridge.exposeInMainWorld(apiKey, api);
