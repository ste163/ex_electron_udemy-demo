const { Menu } = require('electron')
// Always create native menus inside the Main Process
// We will also setup keyboard shortcuts

module.exports = () => {
    // Create Menu Template
    const template = [
        {
            label: 'Items',
            submenu: []
        },
        {
            // Have Electron generate edit menu based on OS
            role: 'editMenu'
        },
        {
            role: 'windowMenu'
        },
        {
            // Convention has a help menu last. We have to add extra content for this role
            role: 'help',
            submenu: []
        }
    ]

    // Mac requires the App name be first item in menu. You MUST do this if you want to support Mac
    // Darwin was original name of MacOS
    if (process.platform === 'darwin') template.unshift({ role: 'appMenu' })

    // Build menu from template
    const menu = Menu.buildFromTemplate(template)

    // Set menu as main app menu
    Menu.setApplicationMenu(menu)
}