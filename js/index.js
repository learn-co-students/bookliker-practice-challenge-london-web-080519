
// get API details

const booksURL = "http://localhost:3000/books"
const usersURL = "http://localhost:3000/users"

function getBooks(url) {
    return fetch(url).then(response => response.json())
}

function getUsers(url) {
    return fetch(url).then(response => response.json())
}

function patch(url, id, inputData) {
    return fetch(`${url}/${id}`, {
        method: "PATCH", 
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }, 
        body: JSON.stringify(inputData)
    }).then(response => response.json())
}

API = { getBooks, patch, getUsers }

//////////


//CONSTANTS
const userArray = []
const list = document.querySelector("ul#list")
const showPanel = document.querySelector("div#show-panel")
const allUsers = getUsers(usersURL).then(u=> u.forEach(storeUsers))
const pouros = getUsers(usersURL).then(user => user[0])

//////////


//FUNCTIONS

// store all users
function storeUsers(u) {
    userArray.push(u)
}

// render all book LIs
function listAllBooks() {
                          // you get back your promise Value.
    API.getBooks(booksURL).then(booksList => booksList.forEach(renderBooks));
    //forEach on the Promise value, and callback function to render books
    API.getUsers(usersURL).then()

}


function renderBooks(book) {
    let li = document.createElement("li")
    li.innerText = book.title
    list.appendChild(li)
    // an. function returns openbook function and passes in your book object
    li.addEventListener("click", () => openBook(book)) 
}


function openBook(book) {
    showPanel.innerHTML = ""
    let h1 = document.createElement("h1")
    h1.innerText = book.title
    let img = document.createElement("img")
    img.setAttribute("src", book.img_url )
    let desc = document.createElement("p")
    desc.innerText = book.description

    let userList = document.createElement("ul")
    userList.className = "userList"
        for (let i=0; i<book.users.length; i++) {
            let li = document.createElement("li")
            li.innerText = book.users[i].username
            userList.appendChild(li)
        }

    let readButton = document.createElement("button")
    readButton.innerText = "Read Book"
    readButton.addEventListener("click", () => handleReadClick(book, ))
  
    showPanel.append(h1, img, desc, userList, readButton )
}


function handleReadClick(readBook) {
    if (readBook.users.find(u=> u.id == 1)) {
        alert("You've already read this book!")
    } else {
        let localBook = readBook
        //I suppose normally you'd use whatever is in the session
        let pouros = {
            "id": 1,
            "username": "pouros"
        }
        localBook.users.push(pouros)
        API.patch(booksURL, readBook.id, localBook ).then(addReader(pouros))
    }
}

function addReader(reader) {
    let readerList = document.querySelector("ul.userList")
    let newReader = document.createElement("li")
    newReader.innerText = reader.username
    readerList.appendChild(newReader)
}


/////////////


// document.addEventListener("DOMContentLoaded", function() {});

// this loads all your books and starts it running!
document.body.onload = listAllBooks




