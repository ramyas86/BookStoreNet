import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBooks, deleteBook } from '../api';
import { toast } from 'react-toastify';
import CustomNavbar from './Navbar';
import SearchComponent from '../components/SearchComponent';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import './BooksPage.css'; // Import the CSS file for styling
import DeleteConfirmation from './DeleteConfirmation'; // Import the DeleteConfirmation component
import EditBookForm from './EditBookForm'; // Import the EditBookForm component
import { Offcanvas, Pagination } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function BooksPage() {
  // State variables
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [bookToEdit, setBookToEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch books from API on component mount
  useEffect(() => {
    refreshBooks();
  }, []);

  // Function to fetch books
  const refreshBooks = async () => {
    setLoading(true);
    try {
      const response = await getBooks();
      setBooks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Error fetching books. Please try again.');
      setLoading(false);
    }
  };

  // Handle delete book action
  const handleDelete = (id) => {
    setBookToDelete(id);
    setShowDeleteModal(true);
  };

  // Confirm book deletion
  const handleConfirmDelete = async () => {
    try {
      await deleteBook(bookToDelete);
      setBooks(books.filter(book => book.book_id !== bookToDelete));
      toast.success('Book deleted successfully!');
      setShowDeleteModal(false);
      setBookToDelete(null);
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error('Error deleting book. Please try again.');
      setShowDeleteModal(false);
      setBookToDelete(null);
    }
  };

  // Handle edit book action
  const handleEdit = (book) => {
    setBookToEdit(book);  // Set the selected book
  };

  // Close edit book offcanvas
  const handleCloseEditOffcanvas = () => {
    setBookToEdit(null);
    refreshBooks();
  };

  // Determine books to display (search results or all books)
  const displayBooks = searchResults ? searchResults : books;

  // Pagination variables
  const itemsPerPage = 6;
  const totalPages = Math.ceil(displayBooks.length / itemsPerPage);

  // Pagination click handler
  const handlePaginationClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate current authors to display based on pagination
  const indexOfLastAuthor = currentPage * itemsPerPage;
  const indexOfFirstAuthor = indexOfLastAuthor - itemsPerPage;
  const currentBooks = displayBooks.slice(indexOfFirstAuthor, indexOfLastAuthor);

  // Handle next button click
  const handleNextClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle previous button click
  const handlePreviousClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <CustomNavbar />
      <div className="search-component-container">
        <SearchComponent setSearchResults={setSearchResults} refreshBooks={refreshBooks} />
      </div>
      <div className="container books-page-container">
        <h2 className="text-center mb-4">Books</h2>
        
        {/* Render loading message */}
        {loading && <p>Loading...</p>}

        {/* Render no books message */}
        {!loading && currentBooks.length === 0 && <p>No books found.</p>}

        {/* Render books */}
        {!loading && currentBooks.length > 0 && (
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {currentBooks.map((book) => (
              <div key={book.book_id} className="col mb-3">
                <div className="card" style={{height: '100% !important'}}>
                  <div className="row g-0 h-100">
                    <div className="col-md-4 d-flex align-items-center">
                      {/* Book image */}
                      <img 
                        src={book.imagePath ? book.imagePath : process.env.PUBLIC_URL + '/images/default_book_image.webp'} 
                        className="book-card-img img-fluid" 
                        alt={book.title} 
                      />
                    </div>
                    <div className="col-md-8">
                      <div className="card-body d-flex flex-column justify-content-between h-100">
                        {/* Book details */}
                        <div className="book-details">
                          <h5 className="card-title">{book.title}</h5>
                          <p className="card-text">Author: {book.author.name}</p>
                          <p className="card-text">Genre: {book.genre.genreName}</p>
                          <p className="card-text">Price: ${book.price}</p>
                          <p className="card-text">Publication Date: {new Date(book.publicationDate).toLocaleDateString()}</p>
                        </div>
                        {/* Edit and delete icons */}
                        <div className="icon-container">
                          <FaEdit className="text-secondary edit-icon" onClick={() => handleEdit(book)} />
                          <FaTrash className="text-danger delete-icon" onClick={() => handleDelete(book.bookId)} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Pagination */}
      <div className="paginate">
        <Pagination>
          <Pagination.Prev onClick={handlePreviousClick} disabled={currentPage === 1} />
          {Array.from({ length: totalPages }, (_, index) => (
            <Pagination.Item
              key={index}
              active={index + 1 === currentPage}
              onClick={() => handlePaginationClick(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={handleNextClick} disabled={currentPage === totalPages} />
        </Pagination>
      </div>

      {/* Delete confirmation modal */}
      <DeleteConfirmation
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleConfirm={handleConfirmDelete}
      />
      
      {/* Edit book offcanvas */}
      {bookToEdit && (
        <Offcanvas show={true} onHide={handleCloseEditOffcanvas} placement="end">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title className='OffcanvasTitleBook'>Edit Book</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <EditBookForm book={bookToEdit} onClose={handleCloseEditOffcanvas} />
          </Offcanvas.Body>
        </Offcanvas>
      )}

      {/* Floating action button to add new book */}
      <Link to="/add-book" className="fab">
        <FaPlus className="fab-icon" />
      </Link>
      <footer className="footer bg-dark text-white text-center py-3">
        <p>&copy; 2024 Bookstore. All rights reserved.</p>
      </footer>
    </>
  );
}

export default BooksPage;
