// FETCH APIS
function get(url) {
  return fetch(url).then(response => response.json());
}

function patch(url, id, userArray) {
  return fetch(url + id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({ users: userArray })
  }).then(response => response.json());
}

API = { get, patch };

// CONSTANTS
const baseUrl = "http://localhost:3000/books/";
const bookUl = document.querySelector("ul#list");
const showBookDiv = document.querySelector("div#show-panel");
const currentUser = { id: 1, username: "pouros" };

// FUNCTIONS

// Users handling functions

function setUsersArray(users) {
  if (users.find(user => user.id === currentUser.id)) {
    let usersArray = users.filter(user => user.id !== currentUser.id);
    return usersArray;
  } else {
    users.push(currentUser);
    return users;
  }
}

function addCurrentUsers(users) {
  const bookUsersDiv = document.querySelector("div#book-likes");
  bookUsersDiv.innerHTML = "";

  users.forEach(user => {
    let userP = document.createElement("p");
    userP.classList = "username";
    userP.innerText = user.username;
    bookUsersDiv.appendChild(userP);
  });
}

// Event Handling functions

function appendThumbnail(book) {
  showBookDiv.innerHTML = "";
  let bookH2 = document.createElement("h2");
  bookH2.innerText = book.title;

  let bookImg = document.createElement("img");
  bookImg.src = book.img_url;

  let bookP = document.createElement("p");
  bookP.innerText = book.description;

  let bookUsersDiv = document.createElement("div");
  bookUsersDiv.setAttribute("id", "book-likes");

  let bookLikeButton = document.createElement("button");
  bookLikeButton.innerText = "Like";
  bookLikeButton;

  showBookDiv.append(bookH2, bookImg, bookP, bookUsersDiv, bookLikeButton);
  addCurrentUsers(book.users);
  let currentUserArray = book.users;

  bookLikeButton.addEventListener("click", event => {
    let updatedUsersArray = setUsersArray(currentUserArray);
    currentUserArray = updatedUsersArray;
    API.patch(baseUrl, book.id, updatedUsersArray).then(book =>
      addCurrentUsers(book.users)
    );
  });
}

function handleBookClick(id) {
  API.get(baseUrl + id).then(appendThumbnail);
}

// Render list of books + event listener on book title

function appendBook(book) {
  let bookLi = document.createElement("li");
  bookLi.innerText = book.title;
  bookUl.appendChild(bookLi);

  bookLi.addEventListener("click", event => {
    handleBookClick(book.id);
  });
}

//EVENT LISTENERS

document.addEventListener("DOMContentLoaded", function() {
  API.get(baseUrl).then(json => {
    json.forEach(appendBook);
  });
});
