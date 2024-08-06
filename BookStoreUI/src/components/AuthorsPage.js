import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuthors, deleteAuthor } from '../api';
import { toast } from 'react-toastify';
import CustomNavbar from './Navbar';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import './AuthorsPage.css'; // Import the CSS file for styling
import DeleteConfirmation from './DeleteConfirmation'; // Import the DeleteConfirmation component
import EditAuthorForm from './EditAuthorForm'; // Import the EditAuthorForm component
import { Offcanvas, Pagination } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import AlphabetFilter from './AlphabetFilter';

function AuthorsPage() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [authorToDelete, setAuthorToDelete] = useState(null);
  const [authorToEdit, setAuthorToEdit] = useState(null);
  const [selectedLetter, setSelectedLetter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  let gotoLastPage = false;

  useEffect(() => {
    refreshAuthors();
  }, []);

  const refreshAuthors = async (selectedLetter) => {
    setLoading(true);
    try {
      const response = await getAuthors(selectedLetter);
      setAuthors(response.data.authors);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching authors:', error);
      toast.error('Error fetching authors. Please try again.');
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setAuthorToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteAuthor(authorToDelete);
      const updatedAuthors = authors.filter((author) => author.authorId !== authorToDelete);
      const totalPages = Math.ceil(updatedAuthors.length / itemsPerPage);
      if (currentPage > totalPages) {
        setCurrentPage(currentPage - 1);
      }
      setAuthors(updatedAuthors);
      toast.success('Author deleted successfully!');
      setShowDeleteModal(false);
      setAuthorToDelete(null);
    } catch (error) {
      console.error('Error deleting author:', error);
      toast.error(error.response.data.error ? error.response.data.error : 'Error deleting author. Please try again.');
      setShowDeleteModal(false);
      setAuthorToDelete(null);
    }
  };

  const handleEdit = (author) => {
    setAuthorToEdit(author);
  };

  const handleCloseEditOffcanvas = () => {
    setAuthorToEdit(null);
    refreshAuthors();
  };

  const filterAuthor = (letter) => {
    setSelectedLetter(letter);
    refreshAuthors(letter);
  };

  const displayAuthors = authors;

  const totalPages = Math.ceil(displayAuthors.length / itemsPerPage);

  const handlePaginationClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePreviousClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const indexOfLastAuthor = currentPage * itemsPerPage;
  const indexOfFirstAuthor = indexOfLastAuthor - itemsPerPage;
  const currentAuthors = displayAuthors.slice(indexOfFirstAuthor, indexOfLastAuthor);

  return (
    <>
      <div>
        <CustomNavbar />
        <div className="container authors-container">
          <h2 className="text-center mb-4">Authors</h2>
          <AlphabetFilter selectedLetter={selectedLetter} onSelectLetter={filterAuthor} />
          {selectedLetter && <p style={{ textAlign: 'center', fontWeight: 'lighter' }}>Authors starting with <b>{selectedLetter}</b></p>}
          {loading && <p>Loading...</p>}
          {!loading && currentAuthors.length === 0 && <p>No authors found.</p>}
          {!loading && currentAuthors.length > 0 && (
            <div className="row row-cols-1 row-cols-md-3 g-4">
              {currentAuthors.map((author) => (
                <div key={author.authorId} className="col mb-3">
                  <div className="card">
                    <div className="row g-0 h-100">
                      <div className="col-md-4 d-flex align-items-center">
                        {author.imagePath ? (
                          <img
                            src={
                              author.imagePath
                                ? author.imagePath
                                : process.env.PUBLIC_URL + '/images/default_author_image.jpg'
                            }
                            className="author-card-img"
                            alt={author.name}
                          />
                        ) : (
                          <div className="author-initial">
                            {author.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="col-md-8">
                        <div className="card-body d-flex flex-column justify-content-between">
                          <div>
                            <h5 className="card-title">{author.name}</h5>
                            <p className="card-text">Biography: {author.biography}</p>
                          </div>
                          <div className="icons-container">
                            <FaEdit
                              className="text-secondary me-2 edit-icon"
                              onClick={() => handleEdit(author)}
                            />
                            <FaTrash
                              className="text-danger delete-icon"
                              onClick={() => handleDelete(author.authorId)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

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
        </div>

        <DeleteConfirmation
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          handleConfirm={handleConfirmDelete}
        />

        {authorToEdit && (
          <Offcanvas show={true} onHide={handleCloseEditOffcanvas} placement="end">
            <Offcanvas.Header closeButton>
              <Offcanvas.Title className='OffcanvasTitle'>Edit Author</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <EditAuthorForm author={authorToEdit} onClose={handleCloseEditOffcanvas} />
            </Offcanvas.Body>
          </Offcanvas>
        )}

        <Link to="/add-author" className="fab">
          <FaPlus className="fab-icon" />
        </Link>
      </div>
      <footer className="footer bg-dark text-white text-center py-3">
        <p>&copy; 2024 Bookstore. All rights reserved.</p>
      </footer>
    </>
  );
}

export default AuthorsPage;
