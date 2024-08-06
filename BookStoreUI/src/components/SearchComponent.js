import React, { useState } from 'react';
import { searchBooks } from '../api';
import './SearchComponent.css'; // Import CSS file for styling
import '@fortawesome/fontawesome-free/css/all.css'; // Import FontAwesome CSS

const SearchComponent = ({ setSearchResults, refreshBooks }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const bookResults = await searchBooks(query);
      setSearchResults(bookResults.data);
    } catch (err) {
      console.error('Error fetching search results:', err);
      setError('Error searching for books');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    setQuery('');
    setLoading(true);
    setError('');
    try {
      await refreshBooks(); // Load all books
      setSearchResults(null);
    } catch (err) {
      console.error('Error loading all books:', err);
      setError('Error loading books');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by book title, author, or genre"
        className="search-input"
      />
      <button onClick={handleSearch} className="icon-button search-button">
        <i className="fas fa-search"></i>
      </button>
      <button onClick={handleClear} className="icon-button clear-button">
        <i className="fas fa-times"></i>
      </button>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default SearchComponent;
