const { BrowserWindow } = require('electron')

// ReadItem
    // creates a new offscreen renderer
    // loads item url
    // takes a screen shot and grabs page title

// Global Offscreen Window --- must be global to prevent it from being garbage collected
let offscreenWindow

// Export readItem function. It's called readItem because of its file name
module.exports = (url, callback) => {
    // Create offscreen window
    offscreenWindow = new BrowserWindow({
        width: 500,
        height: 500,
        show: false,
        webPreferences: {
            offscreen: true
        }
    })

    // Load item url into browser window/renderer
    offscreenWindow.loadURL(url)

    // Wait for content to finish loading before continuing
    offscreenWindow.webContents.on('did-finish-load', e => {
        // Get page title
        const title = offscreenWindow.getTitle()

        // Get screenshot thumbnail
        offscreenWindow.webContents.capturePage().then(image => {
            // Get image as a dataURL to easily store it without storing data to app
            const screenshot = image.toDataURL()

            // Execute callback function with new item object
            callback({ title, screenshot, url })

            // Clean the offScreen window --- best practice
            offscreenWindow.close()
            offscreenWindow = null
        })

    })
}