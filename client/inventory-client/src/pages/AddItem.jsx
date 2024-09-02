import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddItem = () => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [items, setItems] = useState([]);
  // const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/inventory')
        setItems(response.data);
      } catch (error) {
        console.error(error)
      }
    }
    fetchItems();
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newItem = { itemName, quantity, image, description, category };

    try {
      const response = await axios.post('http://localhost:5000/inventory/add', newItem);
      if (response.status === 201) {
        alert('Item added successfully!');
        setItems([...items, response.data]); //add the new item to the state
        setItemName('');
        setQuantity('');
        setImage('');
        setDescription('');
        setCategory('');
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

      <h3>Current Items</h3>
      <ul>
        {items.map(item => (
          <li>
            <img src={item.image} alt={item.itemName} height='50' width='50' />
            <p><b>Name:</b> {item.itemName}</p>
            <p><b>Quantity:</b> {item.quantity}</p>
            <p><b>Description:</b> {item.description}</p>
            <p><b>Category:</b> {item.category}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddItem;
