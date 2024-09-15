import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showTransactions, setShowTransactions] = useState(false);
  const [transactionUserName, setTransactionUserName] = useState('');
  const navigate = useNavigate();

  // Refs for scrolling to different sections
  const createUserSectionRef = useRef(null);
  const staffUsersSectionRef = useRef(null);
  const transactionsSectionRef = useRef(null);

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage("Authentication token is missing. Please log in again.");
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setMessage('Failed to fetch users.');
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (showTransactions) {
      scrollToSection(transactionsSectionRef)
    }
  }, [showTransactions]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      setMessage("Authentication token is missing. Please log in again.");
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/users/create-user',
        {
          name, email, password, isAdmin
        }, {
        headers: {
          'Authorization': `Bearer ${token}` //attach the toke to the request
        }
      })

      setMessage(response.data.message);

      setName('');
      setEmail('');
      setPassword('');
      setIsAdmin(false);
    } catch (error) {
      console.error('Error creating user: ', error)
      setMessage('Failed to create user.')
    }
  }

  const handleEditUser = (user) => {
    setEditMode(true);
    setEditUserId(user._id);
    setName(user.name);
    setEmail(user.email);
    setIsAdmin(user.admin);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      setMessage("Authentication token is missing. Please log in again.");
      navigate('/login');
      return;
    }

    try {
      const updatedData = {
        name,
        email,
        admin: isAdmin,
      };

      if (password) {
        updatedData.password = password;
      }

      const response = await axios.put(
        `http://localhost:5000/users/${editUserId}`,
        updatedData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      setMessage('User updated successfully.');
      setEditMode(false);
      setEditUserId(null);
      setName('');
      setEmail('');
      setPassword('');
      setIsAdmin(false);
      // Update the users list
      setUsers(users.map((user) => (user._id === editUserId ? response.data : user)));
    } catch (error) {
      console.error('Error updating user:', error);
      setMessage('Failed to update user.');
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditUserId(null);
    setName('');
    setEmail('');
    setPassword('');
    setIsAdmin(false);
  };

  const handleDeleteUser = async (userId) => {
    const token = localStorage.getItem('token');

    if (!token) {
      setMessage("Authentication token is missing. Please log in again.");
      navigate('/login');
      return;
    }

    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/users/delete/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        setMessage('User deleted successfully.');
        // Remove the user from the list
        setUsers(users.filter((user) => user._id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
        setMessage('Failed to delete user.');
      }
    }
  };

  const handleViewTransactions = async (userId) => {
    const token = localStorage.getItem('token');

    if (!token) {
      setMessage("Authentication token is missing. Please log in again.");
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/transactions/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setTransactions(response.data);
      const user = users.find((u) => u._id === userId);
      setTransactionUserName(user ? user.name : '');
      setShowTransactions(true);

      // Scroll to the transactions section after fetching
      scrollToSection(transactionsSectionRef);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setMessage('Failed to fetch transactions.');
    }
  }

  return (
    <div className="container mt-5">
      {/* Buttons to scroll to different sections */}
      <div className="d-flex justify-content-center mb-4">
        <button className="btn btn-outline-primary me-3" onClick={() => scrollToSection(createUserSectionRef)}>
          Go to Create User
        </button>
        <button className="btn btn-outline-primary" onClick={() => scrollToSection(staffUsersSectionRef)}>
          Go to Staff Users
        </button>
      </div>

      {/* Create User Section */}
      <div ref={createUserSectionRef}>
        <h1 className="mb-4 text-center">{editMode ? 'Edit User' : 'Create User'}</h1>
        <form className="mb-5" onSubmit={editMode ? handleUpdateUser : handleCreateUser}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Name"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={editMode ? 'New Password (optional)' : 'Enter Password'}
              required={!editMode}
            />
          </div>
          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            />
            <label className="form-check-label">Admin?</label>
          </div>
          <button type="submit" className="btn btn-primary">
            {editMode ? 'Update User' : 'Create User'}
          </button>
          {editMode && (
            <button type="button" className="btn btn-secondary ms-3" onClick={handleCancelEdit}>
              Cancel
            </button>
          )}
        </form>
      </div>
      {message && <div className="alert alert-info">{message}</div>}

      {/* Staff Users Section */}
      <div ref={staffUsersSectionRef}>
        <h2 className="mb-4">Staff Users</h2>
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Admin</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.admin ? 'Yes' : 'No'}</td>
                <td>
                  <button className="btn btn-warning me-2" onClick={() => handleEditUser(user)}>
                    Edit
                  </button>
                  <button className="btn btn-danger me-2" onClick={() => handleDeleteUser(user._id)}>
                    Delete
                  </button>
                  <button className="btn btn-info" onClick={() => handleViewTransactions(user._id)}>
                    View Transactions
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Transactions Section */}
      {showTransactions && (
        <div ref={transactionsSectionRef} className="mt-5">
          <h3 className="mb-4">Transaction History for {transactionUserName}</h3>
          <button className="btn btn-secondary mb-3" onClick={() => setShowTransactions(false)}>
            Close Transactions
          </button>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Taken At</th>
                <th>Returned At</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {console.log("Transaction for adminPage", transactions)}
              {transactions.map((transaction) => (
                <tr key={transaction._id}>
                  {console.log("Transaction for adminPage", transaction)}
                  {/* {console.log(transaction)} */}
                  <td>{transaction.item ? transaction.item.itemName : 'Item not found'}</td>
                  <td>{transaction.item ? transaction.item.quantity : 'Item not found'}</td>
                  <td>{new Date(transaction.takenAt).toLocaleString()}</td>
                  <td>
                    {transaction.returnedAt
                      ? new Date(transaction.returnedAt).toLocaleString()
                      : 'Not Returned'}
                  </td>
                  <td>{transaction.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminPage