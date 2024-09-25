import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import HardwareIcon from '@mui/icons-material/Computer';
import DroneIcon from '@mui/icons-material/Flight';
import ScienceIcon from '@mui/icons-material/Science';
import PrintIcon from '@mui/icons-material/Print';
import MarketingIcon from '@mui/icons-material/Campaign';

const SearchAppBar = () => {
  const [items, setItems] = useState([]);  // State to hold all items
  const [filteredItems, setFilteredItems] = useState([]); // State to hold filtered items
  const [searchQuery, setSearchQuery] = useState(''); // State for the search input

  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/inventory/category/${category}`); // Navigate to the selected category
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('https://inventory-app-server-6r0m.onrender.com/inventory'); // Fetch inventory items
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching inventory items:', error);
      }
    };
    fetchItems();
  }, []);

  // Function to handle search input change
  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query === '') {
      setFilteredItems([]);
    } else {
      const filtered = items.filter(item =>
        item.itemName.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, py: 5, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', mb: 5 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Morrison Mentors Supply Depot
          </Typography>
          <Typography variant="body1" gutterBottom>
            Welcome to our inventory! Search for items by category or use the search bar below.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            To take out an item, please sign in with your assigned email and password.
            All items need to be returned by the end of the day. If not, please let your team lead know.
          </Typography>
        </Paper>

        {/* Search Bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 5 }}>
          <TextField
            variant="outlined"
            placeholder="Search for items..."
            fullWidth
            value={searchQuery}
            onChange={handleSearch}
            sx={{ mr: 2 }}
          />
          <Button variant="contained" color="primary" startIcon={<SearchIcon />}>
            Search
          </Button>
        </Box>

        {/* Display Filtered Items */}
        {searchQuery && (
          <div className="row">
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <div className="col-md-4 mb-4" key={item._id}>
                  <div className="card h-100">
                    <img src={item.image} className="card-img-top" alt={item.itemName} style={{ objectFit: 'cover', height: '200px' }} />
                    <div className="card-body">
                      <h5 className="card-title">{item.itemName}</h5>
                      <p className="card-text">
                        <strong>Quantity:</strong> {item.quantity}
                      </p>
                      <p className="card-text">
                        <strong>Category:</strong> {item.category}
                      </p>
                      <button className='btn btn-primary'>Checkout</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <Typography variant="body1" color="textSecondary">
                No items found.
              </Typography>
            )}
          </div>
        )}

        {/* Categories */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              startIcon={<HardwareIcon />}
              onClick={() => handleCategoryClick('Computer_Hardware')}
              sx={{ height: 60 }}
            >
              Computer Hardware
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              startIcon={<ScienceIcon />}
              onClick={() => handleCategoryClick('Science')}
              sx={{ height: 60 }}
            >
              Science
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              startIcon={<DroneIcon />}
              onClick={() => handleCategoryClick('Drones')}
              sx={{ height: 60 }}
            >
              Drones
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              startIcon={<PrintIcon />}
              onClick={() => handleCategoryClick('3D_Printing')}
              sx={{ height: 60 }}
            >
              3D Printing
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              startIcon={<MarketingIcon />}
              onClick={() => handleCategoryClick('Marketing')}
              sx={{ height: 60 }}
            >
              Marketing
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default SearchAppBar;
