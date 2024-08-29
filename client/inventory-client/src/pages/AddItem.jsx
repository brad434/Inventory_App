// import { useNavigate } from 'react-router';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddItem = () => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newItem = { itemName, quantity, image, description, category };

    try {
      const response = await axios.post('http://localhost:5000/inventory/add', newItem);
      if (response.status === 201) {
        alert('Item added successfully!');
        navigate('/inventory')
      }
    } catch (error) {
      console.error('There was an error adding the item:', error);
    }
  };

  return (
    <div>
      <h2>Add New Item</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="Item Name" required />
        <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Quantity" required />
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        <input type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image Link" />
        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" required />
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
};

export default AddItem;
