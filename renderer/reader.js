// This file is evaluated in our Proxy Browser Windows (our remote content)

// Create button to close remote content
const readitClose = document.createElement('div')
readitClose.innerText = 'Done'

// Style button
readitClose.style.position = 'fixed'
// Position button based on <body>
readitClose.style.bottom = '15px'
readitClose.style.right = '15px'
readitClose.style.padding = '5px 10px'
readitClose.style.fontSize = '20px' // Must be px and not relative or else it'd be relative to remote content
readitClose.style.fontWeight = 'bold'
readitClose.style.background = 'dodgerblue'
readitClose.style.color = 'white'
readitClose.style.borderRadius = '5px'
readitClose.style.cursor = 'default'
readitClose.style.boxShadow = '2px 2px 2px rgba(0,0,0,0.2)'
readitClose.style.zIndex = '9999'

// Attach eventListener to close window
readitClose.onclick = e => {
    // Message the parent window using HTML5 because remote content does not have IPC access
     // The asterisk is for any parent window
    window.opener.postMessage({
        action: 'delete-reader-item',
        itemIndex: {{index}} // False positive error messages
    }, '*')
}

// Append to remote content body --- this file's scope is the remote content
document.getElementsByTagName('body')[0].append(readitClose)

