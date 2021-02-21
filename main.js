// Modules
const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const windowStateKeeper = require('electron-window-state')
const readItem = require('./readItem')
const appMenu = require('./menu')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// Listen for new item request in global scope
ipcMain.on('new-item', (e, itemUrl) => {
  // Get the new item and send back to the renderer
    // readItem is the function (named from the file name) that has its second param as a callback function,
    // which we write as the response back
  readItem(itemUrl, item => {
    // e.sender allows you to gain access to which renderer sent the message
    e.sender.send('new-item-success', item)
  })
})

// Create a new BrowserWindow when `app` is ready
function createWindow () {

  // Window state keeper --- for having the same window location & size based on when the user closed app
  let winState = new windowStateKeeper({
    defaultWidth: 500, defaultHeight: 650
  })

  mainWindow = new BrowserWindow({
    x: winState.x, y: winState.y,
    width: winState.width, height: winState.height,
    minWidth: 350, maxWidth: 650, minHeight: 300,
    webPreferences: { nodeIntegration: true }
  })

  // Create app menu (it's name based on what we call in import)
  appMenu(mainWindow.webContents) 

  // Load main.html into the new BrowserWindow
  mainWindow.loadFile('renderer/main.html')

  // Tell the windowStateKeeper which window it should manager
  winState.manage(mainWindow)

  // Open DevTools - Remove for PRODUCTION!
  // mainWindow.webContents.openDevTools()

  // Listen for window being closed
  mainWindow.on('closed',  () => {
    mainWindow = null
  })
}

// Electron `app` is ready
app.on('ready', createWindow)

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
