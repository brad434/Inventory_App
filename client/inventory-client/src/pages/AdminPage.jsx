import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router';

const AdminPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    console.log('Token', token)

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
      console.log(response.data.message);

      setName('');
      setEmail('');
      setPassword('');
      setIsAdmin(false);
    } catch (error) {
      console.error('Error creating user: ', error)
      setMessage('Failed to create user.')
    }
  }

  return (
    <div>
      <h1>Admin Dashboard - Create User</h1>
      <form onSubmit={handleCreateUser}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <label>
          <input type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
          Admin?
        </label>
        <button type="submit">Create User</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}

export default AdminPage