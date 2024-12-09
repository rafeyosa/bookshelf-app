const books = [];
const RENDER_EVENT = "render-book";
const STORAGE_KEY = "BOOKSHELF_APP";
var isSearch = false;

document.addEventListener(RENDER_EVENT, function () {
  if (isSearch) {
    let searhResult = searchBooks();
    loadData(searhResult);
  } else {
    loadData(books);
  }
  checkActiveClearSerach();
});

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("bookForm");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    isSearch = false;
    addBook();
    clearForm();
  });

  const searchForm = document.getElementById("searchBook");
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    isSearch = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
  });

  const clearSearchButton = document.getElementById("clearSearch");
  clearSearchButton.addEventListener("click", function () {
    document.getElementById("searchBookTitle").value = "";
    isSearch = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
  });

  loadData(books);
  checkActiveClearSerach();

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function checkActiveClearSerach() {
  document.getElementById("clearSearch").disabled = !isSearch;
}

function loadData(books) {
  if (books == null) return;

  const incompleteBookList = document.getElementById("incompleteBookList");
  incompleteBookList.innerHTML = "";
  const completeBookList = document.getElementById("completeBookList");
  completeBookList.innerHTML = "";

  let hasIncompleteBooks = false;
  let hasCompleteBooks = false;

  for (const book of books) {
    const bookElement = createBookItem(book);

    if (book.isComplete) {
      hasCompleteBooks = true;
      completeBookList.append(bookElement);
    } else {
      hasIncompleteBooks = true;
      incompleteBookList.append(bookElement);
    }
  }

  if (!hasIncompleteBooks) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = isSearch
      ? "Tidak ada buku ditemukan"
      : "Tidak ada buku yang belum selesai dibaca.";
    emptyMessage.className = "empty-book";
    incompleteBookList.append(emptyMessage);
  }

  if (!hasCompleteBooks) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = isSearch
      ? "Tidak ada buku ditemukan"
      : "Tidak ada buku yang selesai dibaca.";
    emptyMessage.className = "empty-book";
    completeBookList.append(emptyMessage);
  }
}

function clearForm() {
  document.getElementById("bookFormTitle").value = "";
  document.getElementById("bookFormAuthor").value = "";
  document.getElementById("bookFormYear").value = "";
  document.getElementById("bookFormIsComplete").checked = false;
  document.getElementById("searchBookTitle").value = "";

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function createBookItem(book) {
  const bookItem = document.createElement("div");
  bookItem.className = "book-item";
  bookItem.setAttribute("data-bookid", book.id);
  bookItem.setAttribute("data-testid", "bookItem");

  const bookTitle = document.createElement("h3");
  bookTitle.className = "book-title";
  bookTitle.setAttribute("data-testid", "bookItemTitle");
  bookTitle.textContent = book.title;

  const bookAuthor = document.createElement("p");
  bookAuthor.className = "book-author";
  bookAuthor.setAttribute("data-testid", "bookItemAuthor");
  bookAuthor.textContent = `Penulis: ${book.author}`;

  const bookYear = document.createElement("p");
  bookYear.className = "book-year";
  bookYear.setAttribute("data-testid", "bookItemYear");
  bookYear.textContent = `Tahun: ${book.year}`;

  const bookActions = document.createElement("div");
  bookActions.className = "book-actions";

  const completeButton = document.createElement("button");
  completeButton.setAttribute("data-testid", "bookItemIsCompleteButton");
  if (book.isComplete) {
    completeButton.textContent = "Belum selesai dibaca";
  } else {
    completeButton.textContent = "Selesai dibaca";
  }
  completeButton.addEventListener("click", function () {
    addBookToAnotherRack(book.id, book.isComplete);
  });

  const deleteButton = document.createElement("button");
  deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
  deleteButton.textContent = "Hapus Buku";
  deleteButton.addEventListener("click", function () {
    deleteBook(book.id);
  });

  const editButton = document.createElement("button");
  editButton.setAttribute("data-testid", "bookItemEditButton");
  editButton.textContent = "Edit Buku";
  editButton.addEventListener("click", function () {
    editBook(book.id);
  });

  bookActions.appendChild(completeButton);
  bookActions.appendChild(deleteButton);
  bookActions.appendChild(editButton);

  bookItem.appendChild(bookTitle);
  bookItem.appendChild(bookAuthor);
  bookItem.appendChild(bookYear);
  bookItem.appendChild(bookActions);

  return bookItem;
}

function addBook() {
  const textTitle = document.getElementById("bookFormTitle").value;
  const textAuthor = document.getElementById("bookFormAuthor").value;
  const textYear = document.getElementById("bookFormYear").value;
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const generatedID = generateId();
  const book = generateBook(
    generatedID,
    textTitle,
    textAuthor,
    Number(textYear),
    isComplete
  );
  books.push(book);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addBookToAnotherRack(id, isComplete) {
  const book = findBook(id);

  if (book == null) return;

  book.isComplete = !isComplete;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function deleteBook(id) {
  const index = findBookIndex(id);

  if (index === -1) return;

  books.splice(index, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function editBook(id) {
  const book = findBook(id);
  if (!book) return alert("Buku tidak ditemukan!");

  const editBookTitle = document.getElementById("editBookTitle");
  const editBookAuthor = document.getElementById("editBookAuthor");
  const editBookYear = document.getElementById("editBookYear");

  editBookTitle.value = book.title;
  editBookAuthor.value = book.author;
  editBookYear.value = book.year;

  const popUp = document.getElementById("editBookPopUp");
  popUp.style.display = "flex";

  const editBookForm = document.getElementById("editBookForm");
  editBookForm.onsubmit = function (event) {
    event.preventDefault();

    book.title = editBookTitle.value;
    book.author = editBookAuthor.value;
    book.year = Number(editBookYear.value);

    popUp.style.display = "none";
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  };

  const cancelEditBook = document.getElementById("editBookCancel");
  cancelEditBook.onclick = function () {
    popUp.style.display = "none";
  };
}

function searchBooks() {
  const searchInput = document
    .getElementById("searchBookTitle")
    .value.trim()
    .toLowerCase();

  const searhResult = books.filter((book) => {
    return book.title.toLowerCase().includes(searchInput);
  });

  return searhResult;
}

function generateId() {
  return +new Date();
}

function generateBook(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function findBook(id) {
  for (const book of books) {
    if (book.id === id) {
      return book;
    }
  }
  return null;
}

function findBookIndex(id) {
  for (const index in books) {
    if (books[index].id === id) {
      return index;
    }
  }
  return -1;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}
