import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

const AddItem = () => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/inventory');
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newItem = { itemName, quantity, image, description, category };

    try {
      const response = await axios.post('http://localhost:5000/inventory/add', newItem);
      if (response.status === 201) {
        alert('Item added successfully!');
        setItems([...items, response.data]); // Add the new item to the state
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
    <div className="container mt-4">
      <h2 className="mb-4">Add New Item</h2>
      <form onSubmit={handleSubmit} className="mb-5">
        <div className="form-group mb-3">
          <input
            type="text"
            className="form-control"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="Item Name"
            required
          />
        </div>
        <div className="form-group mb-3">
          <input
            type="number"
            className="form-control"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantity"
            required
          />
        </div>
        <div className="form-group mb-3">
          <input
            type="text"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
        </div>
        <div className="form-group mb-3">
          <input
            type="text"
            className="form-control"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Image Link"
          />
        </div>
        <div className="form-group mb-3">
          <input
            type="text"
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Item</button>
      </form>

      <h3>Current Items</h3>
      <div className="row">
        {items.map((item) => (
          <div key={item._id} className="col-md-4 mb-4">
            <div className="card">
              {item.image && (
                <img src={item.image} className="card-img-top" alt={item.itemName} style={{ height: '200px', objectFit: 'cover' }} />
              )}
              <div className="card-body">
                <h5 className="card-title">{item.itemName}</h5>
                <p className="card-text"><b>Quantity:</b> {item.quantity}</p>
                <p className="card-text"><b>Description:</b> {item.description}</p>
                <p className="card-text"><b>Category:</b> {item.category}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddItem;
