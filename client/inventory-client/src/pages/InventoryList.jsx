import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

const InventoryList = ({ isLoggedIn, user }) => {
  const [items, setItems] = useState([]);
  const [checkoutQuantity, setCheckoutQuantity] = useState({}); // State to manage quantities for checkout

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/inventory');
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching inventory items:', error);
      }
    };
    fetchItems();
  }, []);

  const handleCheckout = async (itemId, userId, quantity) => {
    if (!userId) {
      alert("User not authenticated. Please log in.")
      return;
    }

    try {
      const token = localStorage.getItem('token'); // Retrieve token from local storage
      const response = await axios.post('http://localhost:5000/transactions/checkout', {
        itemId,
        userId,  // Using userId from user object
        quantity
      },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Ensure token is included
          },
        }
      );

      if (response.status === 201) {
        alert('Item(s) successfully checked out.');
        setItems((prevItems) =>
          prevItems.map((item) =>
            item._id === itemId ? { ...item, quantity: item.quantity - quantity } : item
          )
        );
        setCheckoutQuantity((prevQuantities) => ({
          ...prevQuantities,
          [itemId]: 0, // Reset quantity to 0 after checkout
        }));
      } else {
        alert('Failed to checkout item(s).');
      }
    } catch (error) {
      console.error('Error checking out item(s):', error);
      alert('Error checking out item(s). Please try again.');
    }
  };

  const handleQuantityChange = (itemId, change) => {
    setCheckoutQuantity((prevQuantities) => {
      const newQuantity = (prevQuantities[itemId] || 0) + change;
      const item = items.find((item) => item._id === itemId);
      if (!item) return prevQuantities; // prevents error if the item is not found
      if (newQuantity <= 0 || newQuantity > items.find(item => item._id === itemId).quantity) {
        return prevQuantities; // Prevent setting invalid quantity
      }
      return { ...prevQuantities, [itemId]: newQuantity };
    });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Inventory List</h2>
      <div className="row">
        {items.map((item) => (
          <div className="col-md-4 mb-4" key={item._id}>
            <div className="card h-100">
              <img src={item.image} className="card-img-top" alt={item.itemName} style={{ objectFit: 'cover', height: '200px' }} />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{item.itemName}</h5>
                <p className="card-text">
                  <strong>Category:</strong> {item.category}
                </p>
                <p className="card-text">
                  <strong>Quantity Available:</strong> {item.quantity}
                </p>
                <p className="card-text">
                  <strong>Description:</strong> {item.description}
                </p>
                {isLoggedIn ? (
                  <>
                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => handleQuantityChange(item._id, -1)}
                          disabled={(checkoutQuantity[item._id] || 0) <= 0}
                        >
                          -
                        </button>
                      </div>
                      <input
                        type="text"
                        className="form-control text-center"
                        value={checkoutQuantity[item._id] || 0}
                        readOnly
                      />
                      <div className="input-group-append">
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => handleQuantityChange(item._id, 1)}
                          disabled={(checkoutQuantity[item._id] || 0) >= item.quantity}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        handleCheckout(item._id, user ? user.id : null, checkoutQuantity[item._id] || 0);
                      }
                      } // Use user.id here
                      disabled={!checkoutQuantity[item._id] || checkoutQuantity[item._id] > item.quantity}
                    >
                      Checkout
                    </button>
                    <button
                      className="btn btn-danger ml-2"
                      onClick={() => handleQuantityChange(item._id, -checkoutQuantity[item._id])}
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
    </div >
  );
};

export default InventoryList;
