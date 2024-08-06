import React from 'react';
import './HomePage.css';
import home_image from './images/bookstore.jpg'
import CustomNavbar from './Navbar';

const HomePage = () => {
  return (
    <>
    <div className="homepage">
      <CustomNavbar />
      <header className="header bg-light text-center py-5">
        <h1>Welcome to the Bookstore</h1>
        <p className="lead">Your one-stop shop for all your reading needs</p>
      </header>
      <div className="hero-section position-relative">
        <img src={home_image} alt="Bookstore" className="img-fluid hero-image" />
        <div className="hero-text position-absolute top-50 start-50 translate-middle text-center text-white">
          <h2 data-aos="fade-up">Discover Your Next Favorite Book</h2>
          <a href='/books'><button className="btn btn-primary btn-lg mt-3" data-aos="fade-up" data-aos-delay="200">Browse Books</button></a>
        </div>
      </div>
      <section className="features py-5 text-center">
        <div className="container">
          <div className="row">
            <div className="col-md-4" data-aos="fade-up">
              <h3>Wide Selection</h3>
              <p>Choose from thousands of titles across all genres</p>
            </div>
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="200">
              <h3>Top Authors</h3>
              <p>Find books from bestselling authors and rising stars</p>
            </div>
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="400">
              <h3>Great Prices</h3>
              <p>Enjoy competitive pricing and special offers</p>
            </div>
          </div>
        </div>
      </section>
      <footer className="footer bg-dark text-white text-center py-3">
        <p>&copy; 2024 Bookstore. All rights reserved.</p>
      </footer>
    </div>
    </>
  );
};

export default HomePage;
