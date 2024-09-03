import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import Navbar from './components/NavBar';
import HomePage from './pages/HomePage';
import AddItem from './pages/AddItem';
import InventoryList from './pages/InventoryList';
import UpdateItem from './pages/UpdateItem';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import CategoryComponent from './components/CategoryComponent';
import Account from './pages/Account'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();


  // useEffect(() => {
  //   const token = localStorage.getItem('authToken');
  //   const adminStatus = localStorage.getItem('isAdmin') === 'true';
  //   if (token) {
  //     setIsLoggedIn(true);
  //     setIsAdmin(adminStatus);
  //   }
  // }, [])

  // const handleLogin = (user) => {
  //   setIsLoggedIn(true);
  //   setIsAdmin(user.admin || false);
  //   localStorage.setItem('authToken', user.token); // stores the token in local storage
  //   localStorage.setItem('isAdmin', user.admin);  //stores admin status in local storage
  // }

  const handleLogout = () => {
    setToken(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
    localStorage.removeItem('authToken'); // removes token from local storage
    localStorage.removeItem('isAdmin'); // removes admin status from local storage
    navigate('/');
  }

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/inventory" element={<InventoryList />} />
        {isLoggedIn && isAdmin && (
          <>
            <Route path='/add' element={<AddItem />} />
            <Route path='/admin' element={<AdminPage />} />
          </>
        )}
        <Route path="/inventory/category/:category" element={<CategoryComponent />} />
        <Route path="/update/:id" element={isLoggedIn ? <UpdateItem /> : <LoginPage />} />
        <Route path='/account' element={isLoggedIn ? <Account /> : <LoginPage />} />
        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        {/* <Route path="/account" element={<Account />} /> */}
        {/* <Route path="/admin" element={<AdminPage />} /> */}
      </Routes>
    </>
  )
}

export default App
