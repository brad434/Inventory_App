import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

const CategoryComponent = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/inventory/category/${category}`);
        setProducts(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [category]);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">{category} Items</h1>
      <div className="text-center mb-4">
        <button className="btn btn-primary" onClick={() => window.location.href = '/'}>Back to Home</button>
      </div>
      <div className="row">
        {products.map(product => (
          <div className="col-md-4 mb-4" key={product._id}>
            <div className="card h-100">
              <img src={product.image} className="card-img-top" alt={product.itemName} style={{ objectFit: 'cover', height: '200px' }} />
              <div className="card-body">
                <h5 className="card-title">{product.itemName}</h5>
                <p className="card-text">Available: {product.quantity}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryComponent;
