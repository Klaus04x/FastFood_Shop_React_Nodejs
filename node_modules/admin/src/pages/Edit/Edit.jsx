import React, { useEffect, useState } from 'react'
import './Edit.css'
import { assets } from '../../assets/assets'
import axios from "axios"
import { toast } from 'react-toastify'
import { useParams, useNavigate } from 'react-router-dom'

const Edit = ({ url }) => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [image, setImage] = useState(false);
    const [currentImage, setCurrentImage] = useState("");
    const [categories, setCategories] = useState([]);
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: ""
    });

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${url}/api/category/list`);
            if (response.data.success) {
                setCategories(response.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchFoodItem = async () => {
        try {
            const response = await axios.get(`${url}/api/food/${id}`);
            if (response.data.success) {
                const food = response.data.data;
                setData({
                    name: food.name,
                    description: food.description,
                    price: food.price,
                    category: food.category
                });
                setCurrentImage(food.image);
            } else {
                toast.error("Food item not found");
                navigate('/list');
            }
        } catch (error) {
            toast.error("Error loading food item");
            navigate('/list');
        }
    }

    useEffect(() => {
        fetchCategories();
        fetchFoodItem();
    }, [id]);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        // Validate price
        const price = Number(data.price);
        if (price <= 0) {
            toast.error("Price must be greater than 0");
            return;
        }

        const formData = new FormData();
        formData.append("id", id);
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", price);
        formData.append("category", data.category);
        if (image) {
            formData.append("image", image);
        }

        const response = await axios.post(`${url}/api/food/update`, formData);
        if (response.data.success) {
            toast.success(response.data.message);
            navigate('/list');
        } else {
            toast.error(response.data.message);
        }
    }

    return (
        <div className='edit'>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                <div className="edit-img-upload flex-col">
                    <p>Upload Image</p>
                    <label htmlFor="image">
                        <img
                            src={image ? URL.createObjectURL(image) : `${url}/images/${currentImage}`}
                            alt=""
                        />
                    </label>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
                    <p className='image-note'>Leave empty to keep current image</p>
                </div>
                <div className="edit-product-name flex-col">
                    <p>Product name</p>
                    <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Type here' required />
                </div>
                <div className="edit-product-description flex-col">
                    <p>Product description</p>
                    <textarea onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder='Write content here' required></textarea>
                </div>
                <div className="edit-category-price">
                    <div className="edit-category flex-col">
                        <p>Product category</p>
                        <select onChange={onChangeHandler} value={data.category} name="category" required>
                            <option value="">Select Category</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category.name}>{category.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="edit-price flex-col">
                        <p>Product price</p>
                        <input onChange={onChangeHandler} value={data.price} type="Number" name='price' placeholder='$20' min="0.01" step="0.01" required />
                    </div>
                </div>
                <div className="edit-buttons">
                    <button type='button' onClick={() => navigate('/list')} className='cancel-btn'>Cancel</button>
                    <button type='submit' className='edit-btn'>Update</button>
                </div>
            </form>
        </div>
    )
}

export default Edit
