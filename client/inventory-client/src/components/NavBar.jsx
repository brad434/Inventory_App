import React from 'react'
import { Link, useNavigate } from 'react-router-dom';


const NavBar = ({ isLoggedIn, isAdmin, handleLogout }) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    handleLogout(); //coming from the app.jsx file as a prop
    navigate('/');
  }

  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/inventory">Inventory</Link>
      {isLoggedIn && isAdmin && (
        <>
          <Link to="/add">Add Item</Link>
          <Link to="/admin">Admin</Link>
        </>
      )}

      {isLoggedIn && (
        <>
          <Link to='/account'>Account</Link>
          <Link to="/update/:id">Return</Link>
          <button onClick={handleSignOut}>Log Out</button>
        </>
      )}

      {!isLoggedIn && <Link to="/login">Login</Link>}
    </nav>
  );
};

export default NavBar;