import ipcAPI from '_preload/ipc-api';
import { Color, Titlebar } from 'custom-electron-titlebar';
// eslint-disable-next-line import/no-extraneous-dependencies
import { contextBridge } from 'electron';
import applicationIcon from '../assets/icon.png';

window.addEventListener('DOMContentLoaded', () => {
    // eslint-disable-next-line no-new
    new Titlebar({
        backgroundColor: Color.fromHex('#323233'),
        menu: null,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        icon: applicationIcon,
    });
});

contextBridge.exposeInMainWorld('ipcAPI', ipcAPI);
