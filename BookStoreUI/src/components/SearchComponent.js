import React, { useState, useEffect } from 'react';
import { searchBooks } from '../api';
import './SearchComponent.css'; // Import CSS file for styling
import '@fortawesome/fontawesome-free/css/all.css'; // Import FontAwesome CSS

const SearchComponent = ({ setSearchResults, refreshBooks }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleDebouncedSearch = async () => {
      if (query.length >= 3) {
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
      } else if (query.length > 0) {
        // Display warning if query length is less than 3 but more than 0
        setError('Please enter at least 3 characters to search.');
        setLoading(true);
        try {
          await refreshBooks(); // Load all books
          setSearchResults(null); // Clear search results
        } catch (err) {
          console.error('Error loading all books:', err);
          setError('Error loading books');
        } finally {
          setLoading(false);
        }
      } else {
        // Handle the case when the search query is empty
        await handleClear();
      }
    };

    const debounceTimeout = setTimeout(handleDebouncedSearch, 500); // 500ms debounce

    return () => clearTimeout(debounceTimeout);
  }, [query]);

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
      <div className="input-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by book title, author, or genre"
          className="search-input"
        />
        {query && ( // Show button only if there is text in the search input
          <button onClick={handleClear} className="icon-button clear-button">
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
      {query.length > 0 && query.length < 3 && (
        <p className="warning-message">{error}</p>
      )}
      {loading && <p>Loading...</p>}
      {error && !query && <p className="error-message">{error}</p>}
    </div>
  );
};

export default SearchComponent;
