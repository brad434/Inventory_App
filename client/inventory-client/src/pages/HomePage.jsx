import React from 'react';
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
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/inventory/category/${category}`); // Navigate to the selected category
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
            sx={{ mr: 2 }}
          />
          <Button variant="contained" color="primary" startIcon={<SearchIcon />}>
            Search
          </Button>
        </Box>

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
