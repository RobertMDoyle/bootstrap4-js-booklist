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
        const StoredBooks = [
            {
                title: 'Book One',
                Author: 'John Doe',
                isbn: '3434434'
            },
            {
                title: 'Book Two',
                Author: 'Jane Doe',
                isbn: '5434435'
            }
        ];

        const books = StoredBooks
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
        const container = querySelector('.container');
        const form = document.querySelector('#book-form');
        // Insert div before form. insertBefore structure is (div to insert, before form)
        container.insertBefore(div, form);
    }


    // Clear fields after submit
    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

// Store Class: Handles Storage, such as Local Storage for this Project

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

    // Validate
    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('please fill in all fields', 'danger');
    } else {
        // Instantiate Book (creates new book object for each entered book from form)
        const book = new Book(title, author, isbn);

        // Add Book to UI
        UI.addBookToList(book);

        // Clear the Fields
        UI.clearFields();
    }
});


// Event: Remove a Book. Event listnener added using arrow function
document.querySelector('#book-list').addEventListener('click', (e) => {
    UI.deleteBook(e.target)
});