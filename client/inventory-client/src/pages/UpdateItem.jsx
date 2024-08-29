import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UpdateItem = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      const response = await axios.get(`http://localhost:5000/inventory/${id}`);
      setItem(response.data);
      setQuantity(response.data.quantity);
    };
    fetchItem();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/inventory/${id}/update`, { quantity });
      alert('Quantity updated successfully!');
    } catch (error) {
      console.error('There was an error updating the quantity:', error);
    }
  };

  if (!item) return <div>Loading...</div>;

  return (
    <div>
      <h2>Update Item Quantity</h2>
      <form onSubmit={handleUpdate}>
        <p>{item.itemName}</p>
        <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        <button type="submit">Update Quantity</button>
      </form>
    </div>
  );
};

export default UpdateItem;
