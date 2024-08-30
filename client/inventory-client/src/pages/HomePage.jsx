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