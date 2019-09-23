// API
function get(url) {
    return fetch(url).then(resp => resp.json())
}

function patch(url, id, data) {
    let configObj = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(data)
    }
    return fetch(`${url}${id}`, configObj).then(resp => resp.json())
}

const API = {
    get,
    patch
}

// Variable Declarations
const booksURL = "http://localhost:3000/books/"
const usersURL = "http://localhost:3000/users/"
const listPanel = document.querySelector('div#list-panel')
const list = document.querySelector('ul#list')
const showPanel = document.querySelector('div#show-panel')

let currentUser;
fetch(usersURL+1).then(resp => resp.json()).then(user => currentUser = user)


// Function definitions
function renderAllBooks(e) {
    get(booksURL).then(books => books.forEach(createBookListItem))
}

function createBookListItem(book) {
    let bookLi = document.createElement('li')
    bookLi.innerText = book.title
    bookLi.setAttribute('data-id', book.id)
    bookLi.addEventListener('click', handleBookListItemClick)
    list.append(bookLi)
}

function handleBookListItemClick(e) {
    let bookId = e.target.dataset.id
    get(booksURL + bookId).then(showBookDetails)
}

function showBookDetails(book) {
    if (showPanel.children.length > 0) {
        while (showPanel.firstChild) {
            showPanel.removeChild(showPanel.firstChild)
        }
        createBookDetails(book)
    } else {
        createBookDetails(book)
    }
}

function createBookDetails(book) {
    let title = document.createElement('h3')
    title.innerText = book.title

    let image = document.createElement('img')
    image.src = book.img_url

    let description = document.createElement('p')
    description.innerText = book.description

    let readersHeader = document.createElement('h5')
    readersHeader.innerText = "Readers:"

    let readersList = document.createElement('ul')
    book.users.forEach(user => {
        let reader = createReaderListItem(user)
        readersList.appendChild(reader)
    })

    let button = document.createElement('button')
    let isCurrentUserInList = Array.from(readersList.children).find(reader => parseInt(reader.dataset.id) === currentUser.id)
    
    button.innerText = isCurrentUserInList ? "Unread Book" : "Read Book"
    button.setAttribute('data-id', book.id)
    button.addEventListener("click", handleReadButtonClick)

    showPanel.append(title, image, description, readersHeader, readersList, button)
}

function createReaderListItem(user) {
    let r = document.createElement('li')
    r.innerText = user.username
    r.setAttribute('data-id', user.id)
    return r
}

function handleReadButtonClick(e) {
    let readersOfThisBook = document.querySelectorAll("div#show-panel ul li")
    let readers = Array.from(readersOfThisBook).map(li => {
        return {
            id: parseInt(li.dataset.id),
            username: li.innerText
        }
    })
    let bookIsReadByCurrUser = readers.find(reader => reader.id === currentUser.id)
    if (!bookIsReadByCurrUser) {
        readers.push(currentUser)
        patch(booksURL, e.target.dataset.id, {users: readers}).then(addReaderToList)
        e.target.innerText = "Unread Book"
    } else {
        let currUserIndex = readers.findIndex(reader => reader.id === currentUser.id)
        readers.splice(currUserIndex, 1)
        patch(booksURL, e.target.dataset.id, {users: readers}).then(removeReaderFromList)
        e.target.innerText = "Read Book"
    }
}

function addReaderToList(book) {
    let readers = book.users
    let readersList = document.querySelector('div#show-panel ul')
    let userToAdd = readers.slice(-1)[0]
    let userToAddLi = createReaderListItem(userToAdd)
    readersList.appendChild(userToAddLi)
}

function removeReaderFromList(book) {
    let readersList = document.querySelector('div#show-panel ul')
    let readers = book.users
    while (readersList.firstChild) {
        readersList.removeChild(readersList.firstChild)
    }
    readers.forEach(user => {
        let readerLi = createReaderListItem(user)
        readersList.appendChild(readerLi)
    })
}


// Event Listeners
document.addEventListener("DOMContentLoaded", renderAllBooks);
