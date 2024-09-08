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

  const handleCheckout = async (itemId, userId, quantity, category) => {
    if (!userId) {
      alert("User not authenticated. Please log in.")
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/transactions/checkout', {
        itemId,
        userId,
        quantity,
        category,
      },
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
          [itemId]: 0,
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
      if (!item) return prevQuantities;
      if (newQuantity <= 0 || newQuantity > item.quantity) {
        return prevQuantities;
      }
      return { ...prevQuantities, [itemId]: newQuantity };
    });
  };

  // Handle the delete action (only for admin)
  const handleDelete = async (itemId) => {
    if (!user.isAdmin) {
      alert("Only admins can delete items.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/inventory/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setItems(items.filter(item => item._id !== itemId)); // Remove the deleted item from state
      alert('Item deleted successfully.');
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Inventory List</h2>
      <div className="row">
        {items.map((item) => (
          <div className="col-md-4 col-sm-6 mb-4" key={item._id}>
            <div className="card h-100">
              {item.image && (
                <img src={item.image} className="card-img-top" alt={item.itemName} style={{ objectFit: 'cover', height: '150px' }} />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{item.itemName}</h5>
                <p className="card-text">
                  <strong>Category:</strong> {item.category}
                </p>
                <p className="card-text">
                  <strong>Quantity Available:</strong> {item.quantity}
                </p>
                <p className="card-text text-truncate">
                  <strong>Description:</strong> {item.description}
                </p>

                {isLoggedIn ? (
                  <>
                    <div className="input-group mb-3">
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => handleQuantityChange(item._id, -1)}
                        disabled={(checkoutQuantity[item._id] || 0) <= 0}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        className="form-control text-center"
                        value={checkoutQuantity[item._id] || 0}
                        readOnly
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => handleQuantityChange(item._id, 1)}
                        disabled={(checkoutQuantity[item._id] || 0) >= item.quantity}
                      >
                        +
                      </button>
                    </div>
                    <div className="d-flex justify-content-between">
                      <button
                        className="btn btn-success"
                        onClick={() => handleCheckout(item._id, user ? user.id : null, checkoutQuantity[item._id] || 0)}
                        disabled={!checkoutQuantity[item._id] || checkoutQuantity[item._id] > item.quantity}
                      >
                        Checkout
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleQuantityChange(item._id, -checkoutQuantity[item._id])}
                      >
                        Clear
                      </button>

                      {user.isAdmin && (
                        <button
                          className="btn btn-warning"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <Link to={`/login`} className="btn btn-primary mt-2">Login to checkout</Link>
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
