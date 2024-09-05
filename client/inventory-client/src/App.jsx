import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/NavBar';
import HomePage from './pages/HomePage';
import AddItem from './pages/AddItem';
import InventoryList from './pages/InventoryList';
import UpdateItem from './pages/UpdateItem';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import CategoryComponent from './components/CategoryComponent';
import Account from './pages/Account';
import { jwtDecode } from 'jwt-decode';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(!!token);

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser({ id: decodedToken.id, email: decodedToken.email, isAdmin: decodedToken.isAdmin });
        setIsAdmin(decodedToken.isAdmin);
      } catch (error) {
        console.error("Error decoding token:", error);
        handleLogout();
      }
    }
  }, [token]);



  const handleLogout = () => {
    setToken(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUser(null);
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/inventory" element={<InventoryList user={user} isLoggedIn={isLoggedIn} />} />
        {isLoggedIn && isAdmin && (
          <>
            <Route path='/add' element={<AddItem />} />
            <Route path='/admin' element={<AdminPage />} />
          </>
        )}
        <Route path="/inventory/category/:category" element={<CategoryComponent />} />
        <Route path="/update/:id" element={isLoggedIn ? <UpdateItem /> : <LoginPage />} />
        <Route path='/account' element={isLoggedIn ? <Account user={user} /> : <LoginPage />} />
        <Route path="/login" element={<LoginPage setUser={setUser} setIsLoggedIn={setIsLoggedIn} />} />
      </Routes>
    </>
  );
}

export default App;
