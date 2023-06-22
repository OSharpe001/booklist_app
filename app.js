// BOOK CLASS: REPRESENTS A BOOK
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    };
};

// UI CLASS: HANDLE UI TASKS
class UI {
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach(book => UI.addBookToList(book));
    };

    static addBookToList(book) {
        const list = document.querySelector("#book-list");

        const row = document.createElement("tr");

        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(el) {
        if (el.classList.contains("delete")) {
            el.parentElement.parentElement.remove();
        };
    };

    static showAlert(message, className) {
        const div = document.createElement("div");
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector(".container");
        const form = document.querySelector("#book-form");
        container.insertBefore(div, form);
        // VANISH IN 3 SECONDS
        setTimeout(() => document.querySelector(".alert").remove(), 3000)
    };

    static clearFields() {
        document.querySelector("#title").value = "";
        document.querySelector("#author").value = "";
        document.querySelector("#isbn").value = "";
    };
};

// STORE CLASS: HANDLES STORAGE
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem("books") === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        };

        return books;
    };

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem("books", JSON.stringify(books));
    };

    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            };
        });

        localStorage.setItem("books", JSON.stringify(books));
    };
};

// EVENT: DISPLAY BOOKS
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// EVENT: ADD A BOOK
document.querySelector("#book-form").addEventListener("submit", (e) => {
    // PREVENT ACTUAL SUBMIT
    e.preventDefault();

    // GET FORM VALUES
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const isbn = document.querySelector("#isbn").value;

    // VALIDATE
    // console.log(document.querySelector(".alert"));
    if ((title === "" || author === "" || isbn === "") && document.querySelector(".alert")) {
        document.querySelector(".alert").remove();
        UI.showAlert("Please fill in all fields", "danger");
    } else if (title === "" || author === "" || isbn === "") {
        UI.showAlert("Please fill in all fields", "danger");
    } else {
        // INSTANTIATE BOOK
        const book = new Book(title, author, isbn);
        // console.log(book);

        // ADD BOOK TO UI
        UI.addBookToList(book);

        // ADD BOOK TO STORE
        Store.addBook(book);

        // SHOW SUCCESS MESSAGE
        document.querySelector(".alert").remove();
        UI.showAlert('Book Added', "success");

        // CLEAR FIELDS
        UI.clearFields();
    };
});

// EVENT: REMOVE A BOOK
document.querySelector("#book-list").addEventListener("click", (e) => {
    // REMOVE BOOK FROM UI
    UI.deleteBook(e.target);

    // REMOVE BOOK FROM STORAGE
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // SHOW SUCCESS MESSAGE
    UI.showAlert('Book Removed', "success")
});