import * as React from 'react';
import { Container, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';


const SearchAppBar = () => {

  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/inventory/category/${category}`); // Use navigate to change routes
  };


  return (
    <Box sx={{ flexGrow: 1 }}>
      <>
        <h1>Morrison Mentors Supply Depot </h1>
        <p>Welcome to our inventory! Search for items by category or use the search bar above.</p>
        <p>In order to take out an item, please sign in with your assigned email and password</p>
        <p>All items needs to be returned by the end of the day. If not please let your team lead know.</p>
      </>

      <Container maxWidth="md" sx={{ textAlign: 'center', mt: 5 }}>
        {/* Search Bar */}
        <TextField
          variant="outlined"
          placeholder="Item Search..."
          fullWidth
          sx={{ mb: 4 }}
        />

        {/* Categories */}
        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
          <Button variant="contained" color="primary" onClick={() => handleCategoryClick('Computer_Hardware')}>Computer Hardware</Button>
          <Button variant="contained" color="primary" onClick={() => handleCategoryClick('Drones')}>Drones</Button>
          <Button variant="contained" color="primary" onClick={() => handleCategoryClick('Science')}>Science</Button>
          <Button variant="contained" color="primary" onClick={() => handleCategoryClick('3D_Printing')}>3d Printing</Button>
          <Button variant="contained" color="primary" onClick={() => handleCategoryClick('Marketing')}>Marketing</Button>
        </Box>
      </Container>
    </Box>


  );
}

export default SearchAppBar;