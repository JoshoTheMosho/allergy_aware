// src/components/ResultItem/ResultItem.jsx
import { useState } from 'react';
import './ResultItem.css';

const ResultItem = ({ name, ingredients, allergens }) => {
  const [isIngredientsVisible, setIngredientsVisible] = useState(false);

  const toggleIngredients = () => {
    setIngredientsVisible(!isIngredientsVisible);
  };

  return (
    <div className="result-item">
      <div className="result-content">
        <h3 className="result-title">{name}</h3>

        <div className="result-allergens">
          <h4>Allergens:</h4>
          <div className="allergen-tags">
            {allergens.map((allergen, index) => (
              <span key={index} className="allergen-tag">
                {allergen}
              </span>
            ))}
          </div>
        </div>

        <button onClick={toggleIngredients} className="toggle-ingredients-btn">
          {isIngredientsVisible ? 'Hide Ingredients' : 'Show Ingredients'}
        </button>

        {isIngredientsVisible && (
          <div className="result-ingredients">
            <div className="ingredient-tags">
              {ingredients.map((ingredient, index) => (
                <span key={index} className="ingredient-tag">
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultItem;
