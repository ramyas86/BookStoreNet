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
  const [removeImage, setRemoveImage] = useState(false); // State to track if image should be removed
  const navigate = useNavigate();

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
    setImageFile(null); // Clear the image file
    setImagePreview(null); // Clear the image preview
    setRemoveImage(true); // Set removeImage flag to true
  };

  const handleCancel = () => {
    navigate('/authors');
    onClose(); // Close the offcanvas if cancel is clicked
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedAuthorData = {
      ...formData,
      biography: formData.bio
    };

    const formDataToSend = new FormData();
    for (let key in updatedAuthorData) {
      formDataToSend.append(key, updatedAuthorData[key]);
    }
    console.log(imageFile);
    if (imageFile) {
      formDataToSend.append('authorImage', imageFile);
    } else if (removeImage) {
      formDataToSend.append('remove_image', 'true'); // Add a flag to indicate image removal
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
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="bio" className="form-label">Bio</label>
          <textarea
            className="form-control"
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            required
          ></textarea>
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
