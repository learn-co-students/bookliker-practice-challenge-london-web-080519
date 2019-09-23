// document.addEventListener("DOMContentLoaded", function() {});

// get API details

const booksURL = "http://localhost:3000/books"
const usersURL = "http://http://localhost:3000/users";

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

API = { getBooks, patch }

//////////


//CONSTANTS

const list = document.querySelector("ul#list")
const showPanel = document.querySelector("div#show-panel")

//////////


//FUNCTIONS


// render all book LIs
function listAllBooks() {
                          // you get back your promise Value.
    API.getBooks(booksURL).then(booksList => booksList.forEach(renderBooks));
}                                     //forEach on the Promise value, and callback function to render books



function renderBooks(book) {
    let li = document.createElement("li")
    li.innerText = book.title
    list.appendChild(li)
    //                    // then it is showing
    // if (showPanel.innerHTML !== "") {
    //     li.addEventListener("click", removeNode)
    // } else {
         li.addEventListener("click", () => openBook(book)) // an. function returns openbook function and passes in your book object
    // }
}


function openBook(book) {
    //console.log(book.users)
    showPanel.innerHTML = ""
    let h1 = document.createElement("h1")
    h1.innerText = book.title
    let img = document.createElement("img")
    img.setAttribute("src", book.img_url )
    let desc = document.createElement("p")
    desc.innerText = book.description

    let userList = document.createElement("p")
    userList.className = "userList"
        for (let i=0; i<book.users.length; i++) {
            userList.innerText = book.users[i].username
        }

    let readButton = document.createElement("button")
    readButton.innerText = "Read Book"
    readButton.addEventListener("click", () => handleReadClick(book))
  
    showPanel.append(h1, img, desc, userList, readButton )
}


function handleReadClick(readBook) {
    if (readBook.users.find(e=> e.id == 1)) {
        alert("You've already read this book!")
    } else {
        let localBook = readBook
        //I suppose normally you'd use whatever is in the session
        localBook.users.push({
            "id": 1,
            "username": "pouros"
        })
        API.patch(booksURL, readBook.id, localBook )//.then(showReaders)
    }
}

function showReaders() {
    
    showPanel.append(userList)
}


/////////////




// this loads all your books and starts it running!
document.body.onload = listAllBooks




