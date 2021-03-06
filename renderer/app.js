const { ipcRenderer } = require('electron')
const items = require('./items')
// Handles everything with the UI
// Course has all these in 1 file --- in a real app, separate helper functions


// DOM nodes
const showModal = document.getElementById('show-modal'),
      closeModal = document.getElementById('close-modal'),
      modal = document.getElementById('modal'),
      addItem = document.getElementById('add-item')
      itemUrl = document.getElementById('url')
      search = document.getElementById('search')

// Open modal from menu item
ipcRenderer.on('menu-show-modal', () => {
    showModal.click()
})

// Open selected item from menu
ipcRenderer.on('menu-open-item', () => {
    items.open()
})

// Open selected item in native browser window from menu
ipcRenderer.on('menu-open-item-native', () => {
    items.openNative()
})

// Delete selected item from menu
ipcRenderer.on('menu-delete-item', () => {
    const index = items.getSelectedItem().itemIndex
    items.delete(index)
})

// Focus search input from menu
ipcRenderer.on('menu-focus-search', () => {
    search.focus()
})


// Filter items when searching
search.addEventListener('keyup', e => {
    // Loop through items by making them an array
    Array.from(document.getElementsByClassName('read-item')).forEach(item => {
        // Hide items that don't match search value --- hasMatch returns a bool
        const hasMatch = item.innerText.toLowerCase().includes(search.value)
        // Flex is the default display property
        item.style.display = hasMatch ? 'flex' : 'none'
    })
})


// Navigate list using arrow keys
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        items.changeSelection(e.key)
    }
})

// Disable and Enable modal buttons while submitting
const toggleModalBtns = () => {
    // Check btn state
    if (addItem.disabled === true) {
        // Revert to default state
        addItem.disabled = false
        addItem.style.opacity = 1
        addItem.innerText = 'Add Item'
        closeModal.style.display = 'inline'
    } else {
        // Set to disabled state
        addItem.disabled = true
        addItem.style.opacity = 0.5
        addItem.innerText = 'Adding...'
        closeModal.style.display = 'none'
    }
}



// Listeners from Main Process
// When we get an item back from the Main Process
ipcRenderer.on('new-item-success', (e, newItem) => {
    // Add new item to "items" node
    items.addItem(newItem, true)

    // Enable modal buttons
    toggleModalBtns()

    // Hide modal and clear value
    modal.style.display = 'none'
    itemUrl.value = ''
})




// Setup event Listeners
// Show modal
showModal.addEventListener('click', e => {
    modal.style.display = 'flex'
    // When modal opens, allow user to automatically type into field
    itemUrl.focus()
})

// Hide modal
closeModal.addEventListener('click', e => {
    modal.style.display = 'none'
})

// Add new item
addItem.addEventListener('click', e => {
    const url = itemUrl.value
    // Check if url exists
    if (url) {
        // Send new item to main process to handle screen-grab
        ipcRenderer.send('new-item', url)

        // Disable btns
        toggleModalBtns()
    }
})

// Listen for keyboard submit on Enter key up
itemUrl.addEventListener('keyup', e => {
    // Check for Enter key
    if (e.key === 'Enter') {
        addItem.click()
    }
})