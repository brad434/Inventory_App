import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

const CategoryComponent = ({ isLoggedIn, user }) => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [checkoutQuantity, setCheckoutQuantity] = useState({});

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

  const handleCheckout = async (productId, userId, quantity) => {
    if (!userId) {
      alert("User not authenticated. Please log in.");
      return;
    }

    try {
      const token = localStorage.getItem('token'); // Retrieve token from local storage
      const response = await axios.post('http://localhost:5000/transactions/checkout', {
        itemId: productId,
        userId,  // Using userId from user object
        quantity
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Ensure token is included
        },
      });

      if (response.status === 201) {
        alert('Item(s) successfully checked out.');
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === productId ? { ...product, quantity: product.quantity - quantity } : product
          )
        );
        setCheckoutQuantity((prevQuantities) => ({
          ...prevQuantities,
          [productId]: 0, // Reset quantity to 0 after checkout
        }));
      } else {
        alert('Failed to checkout item(s).');
      }
    } catch (error) {
      console.error('Error checking out item(s):', error);
      alert('Error checking out item(s). Please try again.');
    }
  };

  const handleQuantityChange = (productId, change) => {
    setCheckoutQuantity((prevQuantities) => {
      const newQuantity = (prevQuantities[productId] || 0) + change;
      const product = products.find((product) => product._id === productId);
      if (!product) return prevQuantities; // Prevents error if the product is not found
      if (newQuantity <= 0 || newQuantity > product.quantity) {
        return prevQuantities; // Prevent setting invalid quantity
      }
      return { ...prevQuantities, [productId]: newQuantity };
    });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">{category} Items</h2>
      <div className="row">
        {products.map((product) => (
          <div className="col-md-4 mb-4" key={product._id}>
            <div className="card h-100">
              <img src={product.image} className="card-img-top" alt={product.itemName} style={{ objectFit: 'cover', height: '200px' }} />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.itemName}</h5>
                <p className="card-text"><strong>Quantity Available:</strong> {product.quantity}</p>
                <p className="card-text"><strong>Description:</strong> {product.description}</p>

                {isLoggedIn ? (
                  <>
                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => handleQuantityChange(product._id, -1)}
                          disabled={(checkoutQuantity[product._id] || 0) <= 0}
                        >
                          -
                        </button>
                      </div>
                      <input
                        type="text"
                        className="form-control text-center"
                        value={checkoutQuantity[product._id] || 0}
                        readOnly
                      />
                      <div className="input-group-append">
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => handleQuantityChange(product._id, 1)}
                          disabled={(checkoutQuantity[product._id] || 0) >= product.quantity}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        handleCheckout(product._id, user ? user.id : null, checkoutQuantity[product._id] || 0);
                      }}
                      disabled={!checkoutQuantity[product._id] || checkoutQuantity[product._id] > product.quantity}
                    >
                      Checkout
                    </button>
                    <button
                      className="btn btn-danger ml-2"
                      onClick={() => handleQuantityChange(product._id, -checkoutQuantity[product._id])}
                    >
                      Clear
                    </button>
                    <hr />
                  </>
                ) : (
                  <Link to={`/login`} className="btn btn-primary">Login to checkout</Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryComponent;
