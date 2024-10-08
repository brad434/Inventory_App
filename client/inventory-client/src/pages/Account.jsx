import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, ListGroup, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Account = ({ user }) => {
  const [cart, setCart] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch user transactions when component mounts
  useEffect(() => {
    const fetchUserTransactions = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        const response = await axios.get(`https://inventory-app-server-6r0m.onrender.com/transactions/user/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}` // Attach token for authentication
          }
        });

        const cartItems = response.data.filter(transaction => transaction.status === 'Taken');
        setCart(cartItems);
      } catch (error) {
        console.error('Error fetching user transactions:', error);
        setError('Failed to load transactions. Please try adding items to your cart.');
      }
    };

    if (user) {
      fetchUserTransactions();
    }
  }, [user]);

  const handleReturnItem = async (transactionId) => {
    try {
      console.log("Cart display for cart in account.jsx", cart);

      const token = localStorage.getItem('token'); // Retrieve token from localStorage

      console.log("Token From HandleReturnItem - Account.jsx:", token);
      console.log("this is the transactionId from Account.jsx file: ", transactionId)


      await axios.post(`https://inventory-app-server-6r0m.onrender.com/transactions/return/${transactionId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}` // Attach token for authentication
        }
      });

      setCart(prevCart => prevCart.filter(transaction => transaction._id !== transactionId));

      setSuccessMessage('Item successfully returned!');
      // setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error returning item:', error);
      setError('Failed to return item. Please try again.');
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center">Account Page</h2>
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      {user ? (
        <>
          <h3 className='text-center'>Welcome, {user.email}</h3>
          <h5 className='text-center'>Your Cart (Checked-Out Items):</h5>
          {error && <Alert variant="danger">{error}</Alert>}
          {console.log("cart for account page:", cart)}
          {cart.length > 0 ? (
            <ListGroup>
              {cart.map(transaction => (
                <ListGroup.Item key={transaction._id} className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Item:</strong> {transaction.item?.itemName || 'Item not found.'} <br />
                    <strong>Category:</strong> {transaction.item?.category || 'Item not found.'} <br />
                    <strong>Quantity Taken:</strong> {transaction.item?.quantity || 'Quantity not available'} <br />
                    <strong>Taken At:</strong> {new Date(transaction.takenAt).toLocaleString()}
                  </div>
                  <Button
                    variant="warning"
                    onClick={() => handleReturnItem(transaction._id)}
                  >
                    Return Item
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p>No items currently checked out.</p>
          )}
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </Container>
  );
};

export default Account;
