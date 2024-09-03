import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

const InventoryList = ({ isLoggedIn }) => {
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
    try {
      // Make a request to checkout item with specified quantity
      const response = await axios.post('http://localhost:5000/inventory/checkout', {
        itemId,
        userId,  // Assuming userId is available, adjust accordingly
        quantity
      });

      if (response.status === 201) {
        alert('Item(s) successfully checked out.');
        // Update inventory state after successful checkout
        setItems((prevItems) =>
          prevItems.map((item) =>
            item._id === itemId ? { ...item, quantity: item.quantity - quantity } : item
          )
        );
      } else {
        alert('Failed to checkout item(s).');
      }
    } catch (error) {
      console.error('Error checking out item(s):', error);
      alert('Error checking out item(s). Please try again.');
    }
  };

  const handleQuantityChange = (itemId, value) => {
    setCheckoutQuantity({
      ...checkoutQuantity,
      [itemId]: value
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
                {isLoggedIn ? (<>
                  <div className="input-group mb-3">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Quantity"
                      value={checkoutQuantity[item._id] || ''}
                      min="1"
                      max={item.quantity}
                      onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                    />
                    <button
                      className="btn btn-success"
                      onClick={() => handleCheckout(item._id, 'user123', parseInt(checkoutQuantity[item._id] || '0', 10))} // Replace 'user123' with actual userId
                      disabled={!checkoutQuantity[item._id] || checkoutQuantity[item._id] > item.quantity || checkoutQuantity[item._id] <= 0}
                    >
                      Checkout
                    </button>
                    <button className="btn btn-danger ml-2" onClick={() => handleQuantityChange(item._id, 0)}>
                      Clear
                    </button>
                  </div>
                  <hr />
                </>) :
                  <Link to={`/login`} className="btn btn-primary">Login to checkout</Link>
                }
                {/* <button className='btn btn-primary'>Sign In To Checkout</button> */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryList;
