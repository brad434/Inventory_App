import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const InventoryList = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const response = await axios.get('http://localhost:5000/inventory');
      setItems(response.data);
    };
    fetchItems();
  }, []);

  return (
    <div>
      <h2>Inventory List</h2>
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            <img src={item.image} />
            {item.itemName} - {item.image} - {item.quantity} - {item.category} - {item.description}
            <Link to={`/update/${item._id}`}>Update</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InventoryList;
