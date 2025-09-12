const { app, BrowserWindow, utilityProcess } = require('electron')

const path = require('node:path')

let webServerProcess = null
let webServerPort = 9999 // Default port

const startWebServer = () => {
  try {
    // Launch the web server in a utility process
    webServerProcess = utilityProcess.fork(path.join(__dirname, 'web-server.js'))
    
    webServerProcess.on('spawn', () => {
      console.log('Web server process spawned')
    })
    
    webServerProcess.on('message', (message) => {
      if (message.type === 'server-ready') {
        webServerPort = message.port
        console.log(`Web server is ready on port ${webServerPort}`)
        
        // Notify all windows about the server port
        const windows = BrowserWindow.getAllWindows()
        windows.forEach(win => {
          win.webContents.send('server-port-update', webServerPort)
        })
      } else if (message.type === 'server-error') {
        console.error('Web server error:', message.error)
      }
    })
    
    webServerProcess.on('exit', (code) => {
      console.log(`Web server process exited with code ${code}`)
      webServerProcess = null
    })
    
  } catch (error) {
    console.error('Failed to start web server:', error)
  }
}

const stopWebServer = () => {
  if (webServerProcess) {
    webServerProcess.kill()
    webServerProcess = null
  }
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
  startWebServer()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  stopWebServer()
  setTimeout(() => {
    app.quit()
  }, 500) // Pause for 0.5 seconds before quitting
})

app.on('before-quit', () => {
  stopWebServer()
})



