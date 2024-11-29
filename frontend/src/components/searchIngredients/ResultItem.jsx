// src/components/ResultItem/ResultItem.jsx
import { useState } from 'react';
import {
  Card,
  Typography,
  Button,
  Collapse,
  Box,
  Chip,
} from '@mui/material';

const ResultItem = ({ name, ingredients, allergens }) => {
  const [isIngredientsVisible, setIngredientsVisible] = useState(false);

  const toggleIngredients = () => {
    setIngredientsVisible(!isIngredientsVisible);
  };

  return (
    <Card
      sx={{
        backgroundColor: '#f6f6f6',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        margin: '8px',
        textAlign: 'left',
        width: '500px',
        transition: 'transform 0.2s ease-in-out', // Smooth hover effect
        ':hover': {
          transform: 'scale(1.05)', // Hover effect
        },
        '@media (max-width: 1100px)': {
          maxWidth: '300px', // Adjust width for small screens
          padding: '12px',
        },
      }}
      onClick={() =>
        toggleIngredients()
      }

    >
      <Typography variant="h6" component="h3" fontWeight='bold' gutterBottom>
        {name}
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
        Allergens:
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {allergens.map((allergen, index) => (
          <Chip
            key={index}
            label={allergen}
            sx={{
              backgroundColor: '#ffe9ec',
              color: '#303030',
              padding: '2px 6px',
              borderRadius: '12px',
              fontSize: '1em'
            }}
          />
        ))}
      </Box>

      <Button
        variant="text"
        size="small"
        onClick={toggleIngredients}
        sx={{
          textTransform: 'none',
        }}
      >
        {isIngredientsVisible ? 'Hide Ingredients' : 'Show Ingredients'}
      </Button>

      <Collapse in={isIngredientsVisible} timeout="auto" unmountOnExit>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
            Ingredients:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {ingredients.map((ingredient, index) => (
              <Chip
                key={index}
                label={ingredient}
                color="primary"
                variant="outlined"
                size="medium"
              />
            ))}
          </Box>
        </Box>
      </Collapse>
    </Card>
  );
};

export default ResultItem;
