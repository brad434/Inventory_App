import React from 'react'
import { Link, useNavigate } from 'react-router-dom';


const NavBar = ({ isLoggedIn, isAdmin, handleLogout }) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    handleLogout();
    navigate('/login');
  }

  return (
    <nav>
      {/* <Link to="/">Home</Link>
      {isLoggedIn && <Link to="/inventory">Inventory</Link>}
      {isLoggedIn && <Link to="/add">Add Item</Link>}
      {isLoggedIn && isAdmin && <Link to="/admin">Admin</Link>}
      {isLoggedIn ? (
        <button onClick={handleSignOut}>Sign Out</button>
      ) : (
        <Link to="/login">Login</Link>
      )} */}

      <Link to="/">Home</Link>
      <Link to="/inventory">Inventory</Link>
      {isLoggedIn && isAdmin ? <Link to="/add">Add Item</Link> : null}
      {isLoggedIn && isAdmin ? <Link to="/admin">Admin</Link> : null}
      {isLoggedIn && <Link to='/account'>Account</Link>}
      {<Link to="/login">Login</Link>}
      {<Link to="/update/:id">Return</Link>}
      <button onClick={handleSignOut}>Sign Out</button>
    </nav>
  );
};

export default NavBar;