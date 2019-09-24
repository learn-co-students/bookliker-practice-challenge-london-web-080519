document.addEventListener("DOMContentLoaded", getAndRenderBooks);

// CONSTANTS

const baseURL = "http://localhost:3000/books/";
const showPanel = document.querySelector("#show-panel");
const list = document.querySelector("#list");
const currentUser = { id: 1, username: "pouros" };

//server -- FETCH

function get(url) {
  return fetch(url).then(response => response.json());
}

function patch(url, id, likeObject) {
  return fetch(`${url}${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(likeObject)
  }).then(response => response.json());
}

API = { get, patch };

//functions
function getAndRenderBooks() {
  API.get(baseURL).then(bookList => bookList.forEach(renderBook));
}

function renderBook(book) {
  let li = document.createElement("li");
  li.innerText = book.title;
  list.append(li);
  li.addEventListener("click", () => handleBookClick(book));
}

function handleBookClick(book) {
  while (showPanel.hasChildNodes()) {
    showPanel.removeChild(showPanel.lastChild);
  }
  let header = document.createElement("h2");
  let image = document.createElement("img");
  let description = document.createElement("p");
  header.innerText = book.title;
  image.src = book.img_url;
  description.innerText = book.description;
  showPanel.append(header, image, description);
  let readers = book.users;
  readers.forEach(reader => {
    let readerEl = document.createElement("p");
    readerEl.innerText = reader.username;
    showPanel.append(readerEl);
  });
  filterUsers = readers.filter(reader => reader.id == 1);
  if (filterUsers.length > 0) {
    deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete Book";
    showPanel.append(deleteButton);
    deleteButton.addEventListener("click", () => handleDeleteButtonClick(book));
  } else {
    readButton = document.createElement("button");
    readButton.innerText = "Read Book";
    showPanel.append(readButton);
    readButton.addEventListener("click", () => handleReadButtonClick(book));
  }
}

function handleReadButtonClick(book) {
  event.preventDefault();
  let allUsersArray = book.users;
  allUsersArray.push(currentUser);
  let readUsersObject = { users: allUsersArray };
  API.patch(baseURL, book.id, readUsersObject).then(book => handleBookClick(book));
}

function handleDeleteButtonClick(book) {
  event.preventDefault();
  let allUsersArray = book.users;
  filteredArray = allUsersArray.filter(user => user.username != "pouros");
  let deleteUsersObject = { users: filteredArray };
  API.patch(baseURL, book.id, deleteUsersObject).then(book => handleBookClick(book));
}
