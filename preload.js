const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
  // we can also expose variables, not just functions
})

contextBridge.exposeInMainWorld('electronAPI', {
  onServerPortUpdate: (callback) => {
    ipcRenderer.on('server-port-update', (event, port) => callback(port))
  },
  removeServerPortListener: () => {
    ipcRenderer.removeAllListeners('server-port-update')
  }
})
