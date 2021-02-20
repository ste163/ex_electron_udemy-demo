// items.js holds function for adding items to the list
// and storing them
const fs = require('fs')

// Get readerJS content by using Node's File System module
// Read reader.js and assign its content as a string
// We do this so we can pass it into readerWin.eval()
let readerJS
fs.readFile(`${__dirname}/reader.js`, (err, data) => {
    readerJS = data.toString()
})

// DOM Nodes
const items = document.getElementById('items')

// Storage --- if there's data, parse the string back into an object OR set default to an empty []
exports.storage = JSON.parse(localStorage.getItem('readit-items')) || []

// Persist storage --- must be in a string
exports.save = () => {
    localStorage.setItem('readit-items', JSON.stringify(this.storage))
}

// Set selected items
exports.select = e => {
    // Deselect currently selected, if there is one
    document.getElementsByClassName('read-item selected')[0].classList.remove('selected')

    // Add selected class to clicked item
    e.currentTarget.classList.add('selected')
}

// Select item based on arrow keys --- direction is ArrowUp or ArrowDown
exports.changeSelection = direction => {
    // Get selected item
    const currentItem = document.getElementsByClassName('read-item selected')[0]

    // Handle up/down based on if there is a previous or next element
    if (direction === 'ArrowUp' && currentItem.previousElementSibling) {
        currentItem.classList.remove('selected')
        currentItem.previousElementSibling.classList.add('selected')
    } else if (direction === 'ArrowDown' && currentItem.nextElementSibling) {
        currentItem.classList.remove('selected')
        currentItem.nextElementSibling.classList.add('selected')
    }
}

// Open selected item
exports.open = () => {
    // Only open if we have items
    if (!this.storage.length) return
    
    // Get selected Item
    const currentItem = document.getElementsByClassName('read-item selected')[0]

    // Get item's URL from it's data attribute 'data-url'
    const contentUrl = currentItem.dataset.url

    // Open Proxy Window with saved website inside.
    // Empty string names the new window as the content title
    // nodeIntegration set to false and contextIsolation to true
        // secures the proxy window from the file system
        // runs browser JS in an isolated sandbox
    const readerWin = window.open(contentUrl, '', `
        maxWidth=2000,
        maxHeight=2000,
        width=1200,
        height=800,
        backgroundColor=#DEDEDE
        nodeIntegration=0
        contextIsolation=1
    `)

    // Inject our JavaScript on the readerWin
    readerWin.eval(readerJS)
}

// Adds new item to items node
exports.addItem = (item, isNew = false) => {
    // Create the new item node
    const itemNode = document.createElement('article')
    itemNode.setAttribute('class', 'read-item')
    // Set item url as data attribute --- data attributes allow us to add custom properties to HTML tags and store simple info
    itemNode.setAttribute('data-url', item.url)
    itemNode.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>`

    // Append new item to the items node
    items.appendChild(itemNode)

    // Add eventListener for selecting
    itemNode.addEventListener('click', this.select)

    // Add eventListener for opening --- first click selects, second click opens selected item. Must be in quick succession though
    itemNode.addEventListener('dblclick', this.open)

    // If this is the first item, select it
    if (document.getElementsByClassName('read-item').length === 1) {
        itemNode.classList.add('selected')
    }

    // Add item to storage if it's new
    if (isNew) {
        this.storage.push(item)
        this.save()
    }
}

// Display items from storage on load
this.storage.forEach(item => {
    this.addItem(item)
})