const bookContainer = document.getElementById("book-container");
const list = document.getElementById("list");
const grid = document.getElementById("grid");
const valueIncDec = document.getElementById("value-inc-dec");
const increaseBtn = document.getElementById("increase");
const decreaseBtn = document.getElementById("decrease");
const searchBox = document.getElementById("search-box");
const sortSelect = document.querySelector(".sort select");

const url = "https://api.freeapi.app/api/v1/public/books";

let initialPage = 1;
let booksData = []; // Store fetched books globally

// Fetch data from API
async function getData(url) {
  try {
    const response = await fetch(url);
    const responseData = await response.json();
    booksData = responseData.data.data; // Store books in global variable
    displayBook(booksData);
  } catch (error) {
    console.log("ERROR :", error.message);
  }
}

// Display books in the container
function displayBook(books) {
  bookContainer.innerHTML = "";
  books.forEach((book) => {
    const divElement = document.createElement("div");
    divElement.classList.add("book-box");
    divElement.innerHTML = `
      <a href="${book.volumeInfo.previewLink}" target="_blank">
        <div class="book-box-img">
          <img src="${book.volumeInfo.imageLinks?.thumbnail || ""}" alt="${book.volumeInfo.title}">
        </div>
        <div class="text-content">
          <p class="title"> ${book.volumeInfo.title} </p>
          <p class="author"> Author: <span>${book.volumeInfo.authors?.[0] || "Unknown"}</span></p>
          <p class="publisher"> Publisher: <span>${book.volumeInfo.publisher || "Unknown"}</span> </p>
          <p class="published"> Published on: <span>${book.volumeInfo.publishedDate || "N/A"}</span> </p>
        </div>
      </a>
    `;
    bookContainer.appendChild(divElement);
  });
}

// Search function to filter books by title
searchBox.addEventListener("input", () => {
  const searchText = searchBox.value.toLowerCase();
  const filteredBooks = booksData.filter((book) =>
    book.volumeInfo.title.toLowerCase().includes(searchText)
  );
  displayBook(filteredBooks);
});

// Sorting function
sortSelect.addEventListener("change", () => {
  let sortedBooks = [...booksData];
  switch (sortSelect.value) {
    case "Name (A to Z)":
      sortedBooks.sort((a, b) => a.volumeInfo.title.localeCompare(b.volumeInfo.title));
      break;
    case "Name (Z to A)":
      sortedBooks.sort((a, b) => b.volumeInfo.title.localeCompare(a.volumeInfo.title));
      break;
    case "Date (new to old)":
      sortedBooks.sort((a, b) => new Date(b.volumeInfo.publishedDate) - new Date(a.volumeInfo.publishedDate));
      break;
    case "Date (old to new)":
      sortedBooks.sort((a, b) => new Date(a.volumeInfo.publishedDate) - new Date(b.volumeInfo.publishedDate));
      break;
  }
  displayBook(sortedBooks);
});

// List and grid view toggle
list.addEventListener("click", () => {
  bookContainer.style.gridTemplateColumns = "1fr";
});

grid.addEventListener("click", () => {
  bookContainer.style.gridTemplateColumns = "1fr 1fr 1fr";
});

// Pagination
increaseBtn.addEventListener("click", () => {
  getData(`${url}?page=${initialPage >= 10 ? 10 : ++initialPage}&limit=12`);
});

decreaseBtn.addEventListener("click", () => {
  getData(`${url}?page=${initialPage <= 1 ? 1 : --initialPage}&limit=12`);
});

// Initial fetch of books
getData(url + "?page=1&limit=12");
