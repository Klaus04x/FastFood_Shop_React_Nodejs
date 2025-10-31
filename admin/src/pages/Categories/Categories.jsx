import React, { useEffect, useState } from 'react'
import './Categories.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../../assets/assets'

const Categories = ({ url }) => {
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentCategory, setCurrentCategory] = useState({ id: '', name: '', description: '', image: '' });
    const [image, setImage] = useState(false);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${url}/api/category/list`);
            if (response.data.success) {
                setCategories(response.data.data);
            } else {
                toast.error("Error fetching categories");
            }
        } catch (error) {
            toast.error("Error");
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                const response = await axios.post(`${url}/api/category/remove`, { id });
                if (response.data.success) {
                    toast.success(response.data.message);
                    fetchCategories();
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error("Error");
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if image is required for add mode
        if (!editMode && !image) {
            toast.error("Please upload a category image");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", currentCategory.name);
            formData.append("description", currentCategory.description);

            if (image) {
                formData.append("image", image);
            }

            const endpoint = editMode ? '/api/category/update' : '/api/category/add';

            if (editMode) {
                formData.append("id", currentCategory.id);
            }

            const response = await axios.post(`${url}${endpoint}`, formData);

            if (response.data.success) {
                toast.success(response.data.message);
                setShowModal(false);
                setCurrentCategory({ id: '', name: '', description: '', image: '' });
                setImage(false);
                fetchCategories();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error");
        }
    }

    const openAddModal = () => {
        setEditMode(false);
        setCurrentCategory({ id: '', name: '', description: '', image: '' });
        setImage(false);
        setShowModal(true);
    }

    const openEditModal = (category) => {
        setEditMode(true);
        setCurrentCategory({
            id: category._id,
            name: category.name,
            description: category.description || '',
            image: category.image
        });
        setImage(false);
        setShowModal(true);
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className='categories'>
            <div className="categories-header">
                <h2>All Categories</h2>
                <button onClick={openAddModal} className='add-btn'>Add Category</button>
            </div>

            <div className="categories-table">
                <div className="categories-table-format title">
                    <b>Image</b>
                    <b>Name</b>
                    <b>Description</b>
                    <b>Actions</b>
                </div>
                {categories.map((category, index) => (
                    <div key={index} className='categories-table-format'>
                        <img src={`${url}/images/${category.image}`} alt={category.name} className='category-image' />
                        <p>{category.name}</p>
                        <p>{category.description || 'N/A'}</p>
                        <div className="actions">
                            <button onClick={() => openEditModal(category)} className='edit-btn'>Edit</button>
                            <button onClick={() => handleDelete(category._id)} className='delete-btn'>Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>{editMode ? 'Edit Category' : 'Add Category'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Category Image</label>
                                <label htmlFor="category-image" className='image-upload-label'>
                                    <img
                                        src={image ? URL.createObjectURL(image) : (editMode && currentCategory.image ? `${url}/images/${currentCategory.image}` : assets.upload_area)}
                                        alt=""
                                        className='upload-preview'
                                    />
                                </label>
                                <input
                                    onChange={(e) => setImage(e.target.files[0])}
                                    type="file"
                                    id="category-image"
                                    hidden
                                    accept="image/*"
                                />
                                {editMode && <p className='image-note'>Leave empty to keep current image</p>}
                            </div>
                            <div className="form-group">
                                <label>Category Name</label>
                                <input
                                    type="text"
                                    value={currentCategory.name}
                                    onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={currentCategory.description}
                                    onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
                                    rows="3"
                                />
                            </div>
                            <div className="form-actions">
                                <button type="button" onClick={() => setShowModal(false)} className='cancel-btn'>Cancel</button>
                                <button type="submit" className='submit-btn'>{editMode ? 'Update' : 'Add'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Categories
