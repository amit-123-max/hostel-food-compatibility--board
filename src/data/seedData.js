/**
 * Valid diet classes: 'VEGAN', 'VEGETARIAN', 'NON_VEGETARIAN', 'NO_RESTRICTION'.
 * Note: 'NO_RESTRICTION' is valid for residents only.
 * 
 * @typedef {Object} Resident
 * @property {string} name - The name of the resident.
 * @property {string} diet - The diet class of the resident.
 * @property {string[]} allergens - Array of uppercase, trimmed allergen tags.
 */

/**
 * Valid diet classes: 'VEGAN', 'VEGETARIAN', 'NON_VEGETARIAN'.
 * Note: Price must be a positive whole number (rupees).
 * 
 * @typedef {Object} Dish
 * @property {string} id - Unique dish ID (e.g., 'D01').
 * @property {string} cafe - The name of the cafe.
 * @property {string} name - The name of the dish.
 * @property {string} diet - The diet class of the dish.
 * @property {string[]} ingredients - Array of uppercase, trimmed ingredient tags.
 * @property {number} price - Price per serving (positive whole number).
 */

export const initialBudget = 150;

/** @type {Resident[]} */
export const initialResidents = [
  {
    name: 'Asha',
    diet: 'VEGAN',
    allergens: []
  },
  {
    name: 'Dev',
    diet: 'VEGETARIAN',
    allergens: ['PEANUT']
  },
  {
    name: 'Mira',
    diet: 'NO_RESTRICTION',
    allergens: ['MILK']
  }
];

/** @type {Dish[]} */
export const initialDishes = [
  {
    id: 'D01',
    cafe: 'Hostel Cafe',
    name: 'Lentil Rice Bowl',
    diet: 'VEGAN',
    ingredients: ['LENTIL', 'RICE', 'SPINACH'],
    price: 110
  },
  {
    id: 'D02',
    cafe: 'Library Cafe',
    name: 'Tomato Pasta',
    diet: 'VEGAN',
    ingredients: ['WHEAT', 'TOMATO'],
    price: 150
  },
  {
    id: 'D03',
    cafe: 'Hostel Cafe',
    name: 'Paneer Wrap',
    diet: 'VEGETARIAN',
    ingredients: ['MILK', 'WHEAT'],
    price: 140
  },
  {
    id: 'D04',
    cafe: 'East Cafe',
    name: 'Peanut Noodles',
    diet: 'VEGAN',
    ingredients: ['PEANUT', 'WHEAT'],
    price: 130
  },
  {
    id: 'D05',
    cafe: 'Library Cafe',
    name: 'Egg Sandwich',
    diet: 'NON_VEGETARIAN',
    ingredients: ['EGG', 'WHEAT'],
    price: 100
  }
];
