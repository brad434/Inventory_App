import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/NavBar';
import HomePage from './pages/HomePage';
import AddItem from './pages/AddItem';
import InventoryList from './pages/InventoryList';
import UpdateItem from './pages/UpdateItem';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import CategoryComponent from './components/CategoryComponent';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    if (user.email === 'admin@example.com') {
      setIsAdmin(true);
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
  }

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} handleLogout={handleLogout} />
      <Routes>
        {/* <Route path='/' element={<HomePage />} />
        <Route path='/inventory' element={isLoggedIn ? <InventoryList /> : <LoginPage />} />
        <Route path='/add' element={isLoggedIn && isAdmin ? <AddItem /> : <LoginPage />} />
        <Route path='/update/:id' element={isLoggedIn ? <UpdateItem /> : <LoginPage />} />
        <Route path='/admin' element={isLoggedIn && isAdmin ? <AdminPage /> : <LoginPage />} />
        <Route path='/login' element={<LoginPage handleLogin={handleLogin} />} /> */}

        <Route path="/" element={<HomePage />} />
        <Route path="/add" element={<AddItem />} />
        <Route path="/inventory" element={<InventoryList />} />
        <Route path="/inventory/category/:category" element={<CategoryComponent />} />
        <Route path="/update/:id" element={<UpdateItem />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/login" element={<LoginPage handleLogin={handleLogin} />} />
      </Routes>
    </Router>
  )
}

export default App
