import React, { useContext } from 'react'
import './ExploreMenu.css'
import { storeContext } from '../../context/StoreContext'

const ExploreMenu = ({category,setCategory}) => {
  const { categories, url } = useContext(storeContext);

  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Explore Our Menu</h1>
      <p className='explore-menu-text'>Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.</p>
        <div className="explore-menu-list">
            {categories.map((item,index)=>{
                return (
                    <div onClick={()=>setCategory(prev=>prev===item.name?"All":item.name)} key={index} className="explore-menu-list-item">
                        <img className={category===item.name?"active":""} src={`${url}/images/${item.image}`} alt={item.name} />
                        <p>{item.name}</p>
                    </div>
                )
            })}
        </div>
        <hr />
    </div>
  )
}

export default ExploreMenu
