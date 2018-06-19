import {
  app,
  BrowserWindow,
  ipcMain
} from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow, bucketWindow
const winURL = process.env.NODE_ENV === 'development' ?
  `http://localhost:9080` :
  `file://${__dirname}/index.html`

const bucketURL = process.env.NODE_ENV === 'development' ?
  `http://localhost:9080/#bucket` :
  `file://${__dirname}/index.html#bucket`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 500,
    useContentSize: true,
    width: 350,
    // resizable: false,
    webPreferences: {
      webSecurity: false
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function createBucket() {
  /**
   * Initial window options
   */
  bucketWindow = new BrowserWindow({
    height: 500,
    useContentSize: true,
    width: 800,
    show: false,
    // resizable: false,
    webPreferences: {
      webSecurity: false
    }
  })

  bucketWindow.loadURL(bucketURL)

  bucketWindow.on('closed', () => {
    bucketWindow = null
  })

}

app.on('ready', () => {
  createWindow()
  createBucket()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('bucketsList', (evt, data) => {
  // mainWindow.hide()
  bucketWindow.show()
  bucketWindow.webContents.send('msg', data)
});
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */