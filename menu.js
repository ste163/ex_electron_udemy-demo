const { Menu, shell } = require('electron')
// Always create native menus inside the Main Process
// We will also setup keyboard shortcuts

module.exports = appWin => {
    // Create Menu Template
    const template = [
        {
            label: 'Items',
            submenu: [
                {
                    label: 'Add New',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => {
                        // Does same as clicking plus button to add item
                        // Done by sending a one-way IPC message to app.js
                        // Electron handles this internally, no need to import IPC
                        appWin.send('menu-show-modal')
                    }
                },
                {
                    label: 'Read Item',
                    accelerator: 'CmdOrCtrl+Enter',
                    click: () => {
                        appWin.send('menu-open-item')
                    }
                },
                {
                    label: 'Delete item',
                    accelerator: 'CmdOrCtrl+Delete',
                    click:() => {
                        appWin.send('menu-delete-item')
                    }
                },
                {
                    label: 'Open in Browser',
                    accelerator: 'CmdOrCtrl+Shift+Enter',
                    click: () => {
                        appWin.send('menu-open-item-native')
                    }
                },
                {
                    label: 'Search items',
                    accelerator: 'CmdOrCtrl+F',
                    click: () => {
                        appWin.send('menu-focus-search')
                    }
                }
            ]
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
            submenu: [
                {
                    label: 'Documentation',
                    click: () => {
                        shell.openExternal('https://google.com')
                    }
                }
            ]
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