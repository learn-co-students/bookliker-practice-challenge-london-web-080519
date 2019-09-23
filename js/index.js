document.addEventListener("DOMContentLoaded", getAndRenderBooks);

baseURL = "http://localhost:3000/books/";
//fetch

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

// render renderBooks

function renderBook(book) {
  let list = document.querySelector("#list");
  let li = document.createElement("li");
  li.innerText = book.title;
  list.append(li);
  li.addEventListener("click", () => handleBookClick(book));
}


function handleBookClick(book) {
    console.log(book.users)
let showPanel = document.querySelector("#show-panel");
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
  let readers = book.users
  readers.forEach(reader => {
      let readerEl = document.createElement("p");
      readerEl.innerText = reader.username;
      showPanel.append(readerEl);
  }) 
  filterUsers = book.users.filter(user => user.username === "pouros");
  if (filterUsers) {
    readButton = document.createElement("button");
    readButton.innerText = "Read Book";
    showPanel.append(readButton);
    readButton.addEventListener("click", handleReadButtonClick(book));
  } else {
    deleteButton = document.createElement("button");
    deleteButton.innerText = "Read Book";
    showPanel.append(deleteButton);
    deleteButton.addEventListener("click", handleDeleteButtonClick(book));
  }
}

function handleReadButtonClick(book) {
  allUsersArray = book.users;
  allUsersArray.push({ id: 1, username: "pouros" });
  usersObject = { users: allUsersArray };
  API.patch(baseURL, book.id, usersObject);
}

function handleDeleteButtonClick(book){
    allUsersArray = book.users;
  allUsersArray.push({ id: 1, username: "pouros" });
  usersObject = { users: allUsersArray };
  API.patch(baseURL, book.id, usersObject);

}
