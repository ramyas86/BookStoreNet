import React, { useState, useEffect } from 'react';
import { getAuthors, getGenres, updateBook } from '../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

const EditBookForm = ({ book, onClose }) => {
  const [formData, setFormData] = useState({
    title: book.title,
    authorId: book.authorId,
    genreId: book.genreId,
    price: book.price,
    publicationDate: book.publicationDate,
    bookImage: book.imagePath,
  });
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(book.imagePath ? book.imagePath : null);
  const [removeImage, setRemoveImage] = useState(false); // State to track if image should be removed
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await getAuthors();
        setAuthors(response.data.authors);
      } catch (error) {
        console.error('Error fetching authors:', error);
      }
    };

    const fetchGenres = async () => {
      try {
        const response = await getGenres();
        setGenres(response.data);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchAuthors();
    fetchGenres();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null); // Clear the image file
    setImagePreview(null); // Clear the image preview
    setRemoveImage(true); // Set removeImage flag to true
  };

  const handleCancel = () => {
    navigate('/books');
    onClose(); // Close the offcanvas if cancel is clicked
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedBookData = {
      ...formData,
      publicationDate: new Date(formData.publicationDate).toISOString().split('T')[0],
      authorId: formData.authorId,
      genreId: formData.genreId,
    };

    const formDataToSend = new FormData();
    for (let key in updatedBookData) {
      formDataToSend.append(key, updatedBookData[key]);
    }
    if (imageFile) {
      formDataToSend.append('bookImage', imageFile);
    } else if (removeImage) {
      formDataToSend.append('remove_image', 'true'); // Add a flag to indicate image removal
    }
    console.log(updatedBookData);

    try {
      await updateBook(book.book_id, formDataToSend);
      toast.success('Book updated successfully!');
      onClose(); // Close the offcanvas
    } catch (error) {
      console.error('Error updating book:', error);
      toast.error('Error updating book. Please try again.');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="authorId" className="form-label">Author</label>
          <select
            className="form-control"
            id="authorId"
            name="authorId"
            value={formData.authorId}
            onChange={handleChange}
            required
          >
            <option value="">Select Author</option>
            {authors.map(author => (
              <option key={author.authorId} value={author.authorId}>
                {author.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="genreId" className="form-label">Genre</label>
          <select
            className="form-control"
            id="genreId"
            name="genreId"
            value={formData.genreId}
            onChange={handleChange}
            required
          >
            <option value="">Select Genre</option>
            {genres.map(genre => (
              <option key={genre.genreId} value={genre.genreId}>
                {genre.genreName}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="publicationDate" className="form-label">Publication Date</label>
          <input
            type="date"
            className="form-control"
            id="publicationDate"
            name="publicationDate"
            value={formData.publicationDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="bookImage" className="form-label">Book Image</label>
          <input
            type="file"
            className="form-control"
            id="bookImage"
            name="bookImage"
            accept="image/*"
            onChange={handleFileChange}
          />
          {imagePreview && (
            <div className="mt-3">
              <img src={imagePreview} alt="Book Preview" style={{ maxWidth: '100%' }} />
              <button type="button" className="btn btn-danger mt-2" onClick={handleRemoveImage}>
              <FontAwesomeIcon icon={faTrash} className="me-2" />
                Remove Image
              </button>
            </div>
          )}
        </div>
        <div className="row justify-content-center mt-4">
          <div className="col-auto">
            <button type="submit" className="btn btn-primary">
            <FontAwesomeIcon icon={faSave} className="me-2" />
              Save Changes
            </button>
          </div>
          <div className="col-auto">
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            <FontAwesomeIcon icon={faTimes} className="me-2" />
              Cancel
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default EditBookForm;
