// items.js holds function for adding items to the list
// and storing them

// Storage --- if there's data, parse the string back into an object OR set default to an empty []
exports.storage = JSON.parse(localStorage.getItem('readit-items')) || []

// Persist storage --- must be in a string
exports.save = () => {
    localStorage.setItem('readit-items', JSON.stringify(this.storage))
}

// DOM Nodes
const items = document.getElementById('items')

// Adds new item to items node
exports.addItem = (item, isNew = false) => {
    // Create the new item node
    const itemNode = document.createElement('article')
    itemNode.setAttribute('class', 'read-item')
    itemNode.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>`

    // append new item to the items node
    items.appendChild(itemNode)

    // add item to storage if it's new
    if (isNew) {
        this.storage.push(item)
        this.save()
    }

}

// Display items from storage on load
this.storage.forEach(item => {
    this.addItem(item)
})
