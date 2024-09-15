import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TextField, Button, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const CategoryComponent = ({ isLoggedIn, user }) => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // State for filtered products
  const [checkoutQuantity, setCheckoutQuantity] = useState({});
  const [searchQuery, setSearchQuery] = useState(''); // State for search input

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/inventory/category/${category}`);
        setProducts(response.data);
        setFilteredProducts(response.data); // Initialize filteredProducts with all products
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
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/transactions/checkout', {
        itemId: productId,
        userId,
        quantity
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
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
      if (!product) return prevQuantities;
      if (newQuantity <= 0 || newQuantity > product.quantity) {
        return prevQuantities;
      }
      return { ...prevQuantities, [productId]: newQuantity };
    });
  };

  // Handle search input change
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === '') {
      setFilteredProducts(products); // If the search query is empty, show all products
    } else {
      const filtered = products.filter((product) =>
        product.itemName.toLowerCase().includes(query)
      );
      setFilteredProducts(filtered);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">{category}</h2>

      {/* Search Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 5 }}>
        <TextField
          variant="outlined"
          placeholder="Search for products..."
          fullWidth
          value={searchQuery}
          onChange={handleSearch}
          sx={{ mr: 2 }}
        />
        <Button variant="contained" color="primary" startIcon={<SearchIcon />}>
          Search
        </Button>
      </Box>

      {/* Display Filtered Products */}
      <div className="row">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
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
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryComponent;
