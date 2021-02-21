const { dialog } = require('electron')
const { autoUpdater } = require('electron-updater')
// Check for and apply any updates. To be really useful, needs a progress bar on the download.

// Disable auto downloading updates
autoUpdater.autoDownload = false

module.exports = () => {
  // Check for available updates from GitHub Releases
  autoUpdater.checkForUpdates()

  // Listen for if update found
  autoUpdater.on('update-available', () => {
    // Prompt user to download / not
    dialog.showMessageBox({
      type: 'info',
      title: 'Update available',
      message: 'A new version of Readit is available. Do you want to update now?',
      buttons: ['Update', 'No']
    }).then(result => {
      // Store which button user clicked
      const buttonIndex = result.response

      // If user selected buttonIndex[0], so Update, download update
      if (buttonIndex === 0) autoUpdater.downloadUpdate()
    })
  })

  // Listen for when download finishes
  autoUpdater.on('update-downloaded', () => {
    // Prompt user to install update
    dialog.showMessageBox({
      type: 'info',
      title: 'Update downloaded',
      message: 'Install and restart now?',
      buttons: ['Yes', 'Next time Readit is opened']
    }).then(result => {
      // Store which button user clicked
      const buttonIndex = result.response

      // If user selected buttonIndex[0], install & restart --- the params handle whether to show installer on windows & auto restart app
      if (buttonIndex === 0) autoUpdater.quitAndInstall(false, true)
    })
  })
}