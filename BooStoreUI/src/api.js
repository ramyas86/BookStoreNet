import axios from 'axios';

const API_BASE_URL = 'https://localhost:7146/api';

const api = await axios.create({
    baseURL: API_BASE_URL,
    headers:{
        'Content-Type': 'application/json',
    },
})

export const updateBook = (id, formData) => {
    return api.put(`/books/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

export const getBooks = () => api.get(`/books`);
export const getBookById = (id) => api.get(`/books/${id}`);
export const addBook = (formData) => {
  return api.post(`/books`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
// export const addBook = (book) => api.post(`/books`, book);
// export const updateBook = (id, book) => api.put(`/books/${id}`, book);
export const deleteBook = (id) => api.delete(`/books/${id}`);

export const getAuthors = (selectedLetter, currentPage) => api.get(`/authors`, { params: { letter : selectedLetter} });
export const getAuthorById = (id) => api.get(`/authors/${id}`);
// export const addAuthor = (author) => api.post(`/authors`, author);

export const addAuthor = (formData) => {
  return api.post(`/authors`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
// export const updateAuthor = (id, author) => api.put(`/authors/${id}`, author);

export const updateAuthor = (id, formData) => {
  return api.put(`/authors/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteAuthor = (id) => api.delete(`/authors/${id}`);

export const getGenres = () => api.get(`/genres`);
export const addGenre = (genre) => api.post(`/genres`, genre);

export const searchBooks = (query) => api.get(`/books/search`, { params: { query } });

