/**
 * @typedef {import('../data/seedData.js').Resident} Resident
 * @typedef {import('../data/seedData.js').Dish} Dish
 */

/**
 * Validates the inputs for the compatibility engine.
 * @param {Resident[]} residents
 * @param {Dish[]} dishes
 * @param {number} budget
 * @returns {string | null} Error string or null if valid
 */
function validateInputs(residents, dishes, budget) {
  // Budget validation: must be a positive whole number
  const parsedBudget = Number(budget);
  if (!Number.isInteger(parsedBudget) || parsedBudget <= 0) {
    return 'INVALID_INPUT: Budget amount is invalid.';
  }

  const dishIds = new Set();
  
  for (let i = 0; i < dishes.length; i++) {
    const dish = dishes[i];
    const rowName = dish.id && dish.id.trim() !== '' ? dish.id : `Index ${i + 1}`;
    
    // Dish ID non-empty
    if (!dish.id || dish.id.trim() === '') return `INVALID_INPUT: Dish Table, Row ${rowName}, ID field`;
    
    // Check for duplicate dish IDs
    if (dishIds.has(dish.id)) {
      return 'DUPLICATE_DISH_ID';
    }
    dishIds.add(dish.id);

    // Other text fields non-empty
    if (!dish.cafe || dish.cafe.trim() === '') return `INVALID_INPUT: Dish Table, Row ${rowName}, Cafe field`;
    if (!dish.name || dish.name.trim() === '') return `INVALID_INPUT: Dish Table, Row ${rowName}, Dish Name field`;
    if (!dish.diet || dish.diet.trim() === '') return `INVALID_INPUT: Dish Table, Row ${rowName}, Diet Class field`;

    // Price must be positive whole number
    const parsedPrice = Number(dish.price);
    if (!Number.isInteger(parsedPrice) || parsedPrice <= 0) {
      return `INVALID_INPUT: Dish Table, Row ${rowName}, Price field`;
    }

    // Ingredients non-empty after trimming
    for (const tag of dish.ingredients) {
      if (!tag || tag.trim() === '') return `INVALID_INPUT: Dish Table, Row ${rowName}, Ingredients field`;
    }
  }

  for (let i = 0; i < residents.length; i++) {
    const resident = residents[i];
    const rowName = resident.name && resident.name.trim() !== '' ? resident.name : `Index ${i + 1}`;

    // Resident text fields non-empty
    if (!resident.name || resident.name.trim() === '') return `INVALID_INPUT: Resident Table, Row ${rowName}, Name field`;
    if (!resident.diet || resident.diet.trim() === '') return `INVALID_INPUT: Resident Table, Row ${rowName}, Diet field`;
    
    // Allergens non-empty after trimming
    for (const tag of resident.allergens) {
      if (!tag || tag.trim() === '') return `INVALID_INPUT: Resident Table, Row ${rowName}, Allergens field`;
    }
  }

  return null;
}

/**
 * Checks if a dish is compatible with a resident's diet.
 * @param {string} dishDiet 
 * @param {string} residentDiet 
 * @returns {boolean}
 */
function checkDiet(dishDiet, residentDiet) {
  const normDish = dishDiet.trim().toUpperCase();
  const normRes = residentDiet.trim().toUpperCase();

  if (normRes === 'NO_RESTRICTION') return true;
  if (normRes === 'VEGAN') return normDish === 'VEGAN';
  if (normRes === 'VEGETARIAN') return normDish === 'VEGAN' || normDish === 'VEGETARIAN';

  return false;
}

/**
 * Calculates compatibility for a given set of residents, dishes, and budget.
 * 
 * @param {Resident[]} residents
 * @param {Dish[]} dishes
 * @param {number} budget
 * @returns {{ error: string | null, compatibleDishes: Dish[], excludedDishes: { dish: Dish, reasons: string[] }[] }}
 */
export function calculateCompatibility(residents, dishes, budget) {
  const validationError = validateInputs(residents, dishes, budget);

  if (validationError) {
    return {
      error: validationError,
      compatibleDishes: [],
      excludedDishes: []
    };
  }

  const compatibleDishes = [];
  const excludedDishes = [];

  for (const dish of dishes) {
    const reasons = [];

    // STRICT EXCLUSION REASON ORDERING LOGIC:
    // 1. Loop through residents in their exact input array order.
    for (const resident of residents) {
      const trimmedResidentName = resident.name.trim();

      // 2. For each resident, check diet first.
      if (!checkDiet(dish.diet, resident.diet)) {
        reasons.push(`DIET:${trimmedResidentName}`);
      }

      // 3. Next, check allergens for this resident.
      // If ingredients match allergens, add in the exact order those ingredients appear in the dish.
      const normalizedAllergens = resident.allergens.map(a => a.trim().toUpperCase());

      for (const ingredient of dish.ingredients) {
        const normalizedIngredient = ingredient.trim().toUpperCase();
        if (normalizedAllergens.includes(normalizedIngredient)) {
          reasons.push(`ALLERGEN:${trimmedResidentName}:${normalizedIngredient}`);
        }
      }
    }

    // 4. Finally, check the budget rule. Append OVER_BUDGET as the very last reason.

    if (dish.price > budget) {
      reasons.push('OVER_BUDGET');
    }



    // If there are no exclusion reasons, the dish is completely compatible
    if (reasons.length === 0) {
      compatibleDishes.push(dish);
    } else {
      excludedDishes.push({ dish, reasons });
    }
  }

  return {
    error: null,
    compatibleDishes,
    excludedDishes
  };
}
