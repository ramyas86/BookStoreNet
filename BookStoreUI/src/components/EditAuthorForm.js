import React, { useState, useEffect } from 'react';
import { updateAuthor } from '../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

const EditAuthorForm = ({ author, onClose }) => {
  const [formData, setFormData] = useState({
    name: author.name,
    bio: author.biography,
    authorImage: author.imagePath,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(author.imagePath ? author.imagePath : null);
  const [removeImage, setRemoveImage] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    setFormData({
      name: author.name,
      bio: author.biography,
      authorImage: author.imagePath,
    });
    setImagePreview(author.imagePath ? author.imagePath : null);
  }, [author]);

  const validateFields = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (formData.bio.trim().length < 10) errors.bio = "Bio is required and must be at least 10 characters long";
    
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);
  };

  const handleCancel = () => {
    navigate('/authors');
    onClose(); // Close the offcanvas if cancel is clicked
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    const updatedAuthorData = {
      ...formData,
      biography: formData.bio
    };

    const formDataToSend = new FormData();
    for (let key in updatedAuthorData) {
      formDataToSend.append(key, updatedAuthorData[key]);
    }

    if (imageFile) {
      formDataToSend.append('authorImage', imageFile);
    } else if (removeImage) {
      formDataToSend.append('removeImage', 'true');
    }

    try {
      await updateAuthor(author.authorId, formDataToSend);
      toast.success('Author updated successfully!');
      onClose(); // Close the offcanvas
    } catch (error) {
      console.error('Error updating author:', error);
      toast.error('Error updating author. Please try again.');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            // required
          />
          {errors.name && <div className="text-danger">{errors.name}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="bio" className="form-label">Bio</label>
          <textarea
            className="form-control"
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            // required
          ></textarea>
          {errors.bio && <div className="text-danger">{errors.bio}</div>}
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

export default EditAuthorForm;
