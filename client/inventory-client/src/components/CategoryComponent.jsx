import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';

const CategoryComponent = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);

  console.log(category);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/inventory/category/${category}`);
        setProducts(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [category]);

  return (
    <div>
      <h1>{category} Page</h1>
      <button onClick={() => window.location.href = '/'}>Back to Home</button>
      <ul>
        {products.map(product => (
          <li key={product._id}>Name: {product.itemName} - Image: <img src={product.image} /> - Available: {product.quantity}</li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryComponent;
