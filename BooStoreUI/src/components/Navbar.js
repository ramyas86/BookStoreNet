import React from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faBook, faPlus } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css'; // Custom CSS file for Navbar styles
import bookstoreLogo from './images/education.png'; // Import your bookstore logo

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <Link to="/" className="navbar-brand">
        <img src={bookstoreLogo} alt="Bookstore Logo" className="logo" /><span> BookStore</span>
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/authors" className="nav-link">
                <FontAwesomeIcon icon={faUserPlus} className="me-1" /> Authors
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/books" className="nav-link">
                <FontAwesomeIcon icon={faBook} className="me-1" /> Books
              </Link>
            </li>
            <Dropdown as="li" className="nav-item">
              <Dropdown.Toggle as={Link} to="#" className="nav-link dropdown-toggle">
                <FontAwesomeIcon icon={faPlus} className="me-1" /> Add
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/add-author">
                  <FontAwesomeIcon icon={faUserPlus} className="me-1" /> Author
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/add-book">
                  <FontAwesomeIcon icon={faBook} className="me-1" /> Book
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
