

// ---- API functions --- //
const API = {get, patch}
const baseURL = "http://localhost:3000/books/"
const currentUser = {"id":1, "username":"pouros"}

function get(url){
    return fetch(url).then(response => response.json())
}


function patch(url, id, bookData){
    let configObj = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(bookData)
    }
    return fetch(`${url}${id}`, configObj).then(response => response.json())
}

// ------ constants -------- //

const bookListPanel = document.querySelector('#list-panel')
let bookList = document.querySelector('#list')
let showPanel = document.querySelector('#show-panel')

// ------ functions -------- //
// ------ show all books -------- //
function getAndRenderBooks(){
    API.get(baseURL).then(bookList => bookList.forEach(renderBooks))
}

function renderBooks(book){
    let newLi = document.createElement('li')
    newLi.innerText = book.title
    newLi.className = `li-${book.id}`
    bookList.append(newLi)
    newLi.addEventListener('click', () => expandBook(book))   
}

// ------ expand book -------- //

function expandBook(event){
    // !! clear previous book version !! 
    while (showPanel.firstChild) {
        showPanel.removeChild(showPanel.firstChild)
    }
    // showPanel.innerHTML = ""
    // add title as h4
    let title = document.createElement('h4')
    title.innerText = event.title
    // add image
    let image = document.createElement('img')
    image.src = event.img_url
    // add description as p
    let description = document.createElement('p')
    description.innerText = event.description
    // add users (username)
    let users = document.createElement('div')
    users.className = `users-for-book-${event.id}`
    event.users.forEach(user => {
        let userLiked = document.createElement('h5')
        userLiked.innerText = user.username
        users.append(userLiked)
    })
    // add button for 'read book'
    let readBookBtn = document.createElement('button')
    readBookBtn.innerText='Read Book'
    readBookBtn.class=`read ${event.id}`
        // add event listener for button, including readBook function
        readBookBtn.addEventListener('click',() => readBook(event))
   
    // append everything to showPanel 
    showPanel.append(title, image, description, users, readBookBtn)
}

// ---------- read book --------- //

function readBook(book){
    let currentUsers = book.users
    // if users.id(1) is found within book.users, alert
    if (currentUsers.find(function(s) {return s === currentUser})) {
        alert('You read this already!')
        currentUsers = currentUsers.filter(user => user !== currentUser)
        book.users = currentUsers
        API.patch(baseURL, `${book.id}`, book).then(removeLikesOnClient)
    }
    // else add to array, patch through to db.json, and update on Client
    else {
        currentUsers.push(currentUser)
        // add your username to the list (patch)
        API.patch(baseURL, `${book.id}`, book).then(updateLikesOnClient)
    }
}

function updateLikesOnClient(book){
    let userLikes = document.querySelector(`.users-for-book-${book.id}`)
    let newUserLike = document.createElement('h5')
    newUserLike.innerText = `${currentUser.username}`
    userLikes.append(newUserLike)
}

function removeLikesOnClient(book){
    let userLikesToRemove = document.querySelector(`.users-for-book-${book.id}`)
    while (userLikesToRemove.firstChild) {
        userLikesToRemove.removeChild(userLikesToRemove.firstChild)
    }
    book.users.forEach(user => {
        let userLiked = document.createElement('h5')
        userLiked.innerText = user.username
        userLikesToRemove.append(userLiked)
    })
}



document.addEventListener("DOMContentLoaded", getAndRenderBooks);
