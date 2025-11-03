import React, { useEffect, useState } from 'react'
import './List.css'
import axios from "axios"
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const List = ({url}) => {

  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    if(response.data.success){
      setList(response.data.data);
    }
    else{
      toast.error("Error")
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${url}/api/category/list`);
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      toast.error("Error fetching categories");
    }
  }

  const removeFood = async(foodId) => {
    const response = await axios.post(`${url}/api/food/remove`,{id:foodId});
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message)
    }
    else{
      toast.error("Error");
    }
  }

  useEffect(()=>{
    fetchList();
    fetchCategories();
},[])

  // Filter list based on selected category
  const filteredList = selectedCategory === 'All'
    ? list
    : list.filter(item => item.category === selectedCategory);

  return (
    <div className='list add flex-col'>
      <div className="list-header">
        <p>All Food List</p>
        <div className="filter-section">
          <label htmlFor="category-filter">Filter by Category:</label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            <option value="All">All Categories</option>
            {categories.map((category, index) => (
              <option key={index} value={category.name}>{category.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Actions</b>
        </div>
        {filteredList.map((item,index)=>{
            return (
              <div key={index} className='list-table-format'>
                  <img src={`${url}/images/`+item.image} alt="" />
                  <p>{item.name}</p>
                  <p>{item.category}</p>
                  <p>${item.price.toFixed(2)}</p>
                  <div className='action-buttons'>
                    <button onClick={()=>navigate(`/edit/${item._id}`)} className='edit-btn-small'>Edit</button>
                    <button onClick={()=>removeFood(item._id)} className='delete-btn-small'>Delete</button>
                  </div>
              </div>
            )
        })}
      </div>

    </div>
  )
}

export default List
