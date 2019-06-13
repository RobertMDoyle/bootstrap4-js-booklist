// Book Class: Represents a Book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class: Handles UI Tasks with Add, Remove and Alerts
class UI {
    // Display Books Method
    static displayBooks() {

        const books = Store.getBooks();
        // Looping books array then calling addBookToList method and passing book in to that method to display books in UI
        books.forEach((book) => UI.addBookToList(book));
    }
    // Add Books Method
    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);

    }
    // Event Propagation by calling parent of parent to remove complete row instead of just X in table
    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        // Insert div before form. insertBefore structure is (div to insert, before form)
        container.insertBefore(div, form);
        // Vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 1200);
    }


    // Clear fields after submit is clicked
    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

// Store Class: Handles Storage, such as Local Storage for this Project. Holds 3 methods - getBooks, addBook and removeBook
class Store {

    static getBooks() {
        let books;
        // check first if there is not an item called 'books' already in local storage
        if (localStorage.getItem('books') === null) {
            // if null, initialize and set to an empty array called books
            books = [];
        } else {
            // else if something is found called books in local storage
            // if so, use JSON.parse to convert to a regular javascript array of objects and not a string as stored in local storage as default
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;

    }

    static addBook(book) {
        // use store class
        const books = Store.getBooks();
        // push on book passed in to addBook(book) to books
        books.push(book);
        // reset to local storage
        // convert books from array of objects back to a strings to work in local storage using JSON.stringify converter
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        // remove by isbn as that is a unique identifyer similar to primary keys
        // get the books
        const books = Store.getBooks();
        // loop through each of the books using a forEach. Also access the index for each book
        books.forEach((book, index) => {
            // check if current book being looped through has an isbn that matches the one that's passed in for remove book
            // grab its index and remove the book once
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        // reset local to update the change as a string
        localStorage.setItem('books', JSON.stringify(books));

    }
}

// Event: Display Books as soon as DOM is loaded
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a Book listens for submit click
document.querySelector('#book-form').addEventListener('submit', (e) => {
    // Prevent actual submit 
    e.preventDefault();

    // Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Validate input fields
    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill in all fields', 'danger');
    } else {
        // Instantiate Book (creates new book object for each entered book from form)
        const book = new Book(title, author, isbn);

        // Add Book to UI
        UI.addBookToList(book);

        // Add book to Store
        Store.addBook(book);

        // Success Message
        UI.showAlert('Book Added', 'success');

        // Clear the Fields
        UI.clearFields();
    }
});


// Event: Remove a Book. Event listnener added using arrow function
document.querySelector('#book-list').addEventListener('click', (e) => {
    // Remove book from UI
    UI.deleteBook(e.target);

    // Remove book from Store
    // traverse the DOM to navigate to isbn. a link(e.target X) => td(parent) => td(previous sibling) => text content(isbn number)
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);


    // Delete Message success
    UI.showAlert('Book Removed', 'success');

});