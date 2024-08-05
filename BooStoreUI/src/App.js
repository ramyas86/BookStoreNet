import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import BooksPage from './components/BooksPage';
import AuthorsPage from './components/AuthorsPage';
import AddBookForm from './components/AddBookForm';
import EditBookForm from './components/EditBookForm';
import AddAuthorForm from './components/AddAuthorForm';
import EditAuthorForm from './components/EditAuthorForm';
// import SearchPage from './components/SearchPage';

import PageNotFound from './components/PageNotFound';
import { ToastContainer } from 'react-toastify';
import SearchComponent from './components/SearchComponent';

function App() {
  return (
    <>
    <Router>
    <ToastContainer />
      <Routes>
        <Route path="/" Component={HomePage} />
        <Route path="/books" Component={BooksPage} />
        {/* <Route path="/books/:id" Component={BookDetails} /> */}
        <Route path="/add-book" Component={AddBookForm} />
        <Route path="/edit-book/:id" Component={EditBookForm} />
        <Route path="/authors" Component={AuthorsPage} />
        {/* <Route path="/authors/:id" Component={AuthorDetails} /> */}
        <Route path="/add-author" Component={AddAuthorForm} />
        <Route path="/edit-author/:id" Component={EditAuthorForm} />
        {/* <Route path="/search" Component={SearchPage} /> */}
        <Route path="/search" Component={SearchComponent} />
        <Route path="*" Component={PageNotFound}></Route>
      </Routes>
    </Router>
    </>
  );
}

export default App;
