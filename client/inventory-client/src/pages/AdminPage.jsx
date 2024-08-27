import React, { useState } from 'react'
import axios from 'axios';

const AdminPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const newUser = { name, email, password, isAdmin };

    try {
      const response = await axios.post('http://localhost:5000/users/register', newUser)
      if (response.status === 201) {
        alert('User created successfully')
        setName('');
        setEmail('');
        setPassword('');
        setIsAdmin(false);
      }
    } catch (error) {
      console.log('Error creating user: ', error)
    }
  }

  return (
    <div>
      <h2>Admin Page</h2>
      <form onSubmit={handleCreateUser}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <label>
          <input type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
          Is Admin
        </label>
        <button type="submit">Create User</button>
      </form>
    </div>
  )
}

export default AdminPage