import React, { useState } from 'react';
import { addAuthor } from '../api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BsXCircleFill } from 'react-icons/bs'; // Import icons
import add_image from './images/addAuthor.jpg';
import './AddAuthorForm.css';
import CustomNavbar from './Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

const AddAuthorForm = () => {
  const [name, setName] = useState('');
  const [biography, setBiography] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateFields = () => {
    const errors = {};
    if (!name.trim()) errors.name = "Name is required";
    if (biography.trim().length < 10) errors.biography = "Biography is required and must be at least 10 characters long";
    
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    try {
      await addAuthor({ name, biography, authorImage: imageFile });
      navigate('/authors');
      toast.success('Author added successfully!');
      setName('');
      setBiography('');
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error adding author:', error);
      toast.error('Error adding author. Please try again.');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleCancel = () => {
    navigate('/authors');
  };

  return (
    <>
      <CustomNavbar />
      
      <div className="container my-3">
        <h2 style={{ textAlign: 'center', margin: '20px 0', fontWeight: 'bold', color: '#333' }}>Add New Author</h2>

        <div className="row">
          <div className="col-md-6">
            <img src={add_image} alt="Add an Author" className="img-fluid" />
          </div>
          <div className="col-md-6 authors-page-container">
            <form onSubmit={handleSubmit} style={{ height: '95%' }}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder='Name of the author'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  // required
                />
                {errors.name && <div className="text-danger">{errors.name}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="biography" className="form-label">Biography</label>
                <textarea
                  className="form-control"
                  id="biography"
                  placeholder="Author's biography"
                  value={biography}
                  onChange={(e) => setBiography(e.target.value)}
                  rows="5"
                ></textarea>
                {errors.biography && <div className="text-danger">{errors.biography}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="authorImage" className="form-label">Author Image</label>
                <input
                  type="file"
                  className="form-control"
                  id="authorImage"
                  name="authorImage"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {imagePreview && (
                  <div className="mt-3">
                    <img src={imagePreview} alt="Author Preview" style={{ maxWidth: '100%' }} />
                    <button type="button" className="btn btn-danger mt-2" onClick={handleRemoveImage}>
                      Remove Image
                    </button>
                  </div>
                )}
              </div>
              <div className="text-center">
                <button type="submit" className="btn btn-primary mx-2">
                  <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                  Add Author
                </button>
                <button type="button" className="btn btn-secondary mx-2" onClick={handleCancel}>
                  <BsXCircleFill className="mb-1" />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddAuthorForm;
