import React, { useState, useEffect } from 'react'
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
        await axios.delete(`http://localhost:5000/users/${userId}`, {
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
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setMessage('Failed to fetch transactions.');
    }
  }

  return (
    <div>
      <h1>Admin Dashboard - Create User</h1>
      <form onSubmit={editMode ? handleUpdateUser : handleCreateUser}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <label>
          <input type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
          Admin?
        </label>
        <button type="submit">{editMode ? 'Update User' : 'Create User'}</button>
        {editMode && <button onClick={handleCancelEdit}>Cancel</button>}
      </form>
      {message && <p>{message}</p>}


      <h2>Staff Users</h2>
      <table>
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
                <button onClick={() => handleEditUser(user)}>Edit</button>
                <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
                <button onClick={() => handleViewTransactions(user._id)}>View Transactions</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showTransactions && (
        <div>
          <h3>Transaction History for {transactionUserName}</h3>
          <button onClick={() => setShowTransactions(false)}>Close</button>
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Taken At</th>
                <th>Returned At</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td>{transaction.item.itemName}</td>
                  <td>{new Date(transaction.takenAt).toLocaleString()}</td>
                  <td>{transaction.returnedAt ? new Date(transaction.returnedAt).toLocaleString() : 'Not Returned'}</td>
                  <td>{transaction.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  )
}

export default AdminPage