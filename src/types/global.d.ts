declare global {
  interface Window {
    ipcAPI?: typeof import('_preload/ipc-api').default
  }
}

export { };
