import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { calculateCompatibility } from './compatibility.js';
import { initialResidents, initialDishes, initialBudget } from '../data/seedData.js';

// Helper to deeply clone arrays for independent test mutations
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

describe('Compatibility Engine', () => {
  test('Default Built-in Group & Budget (₹150) returns expected output', () => {
    const result = calculateCompatibility(initialResidents, initialDishes, initialBudget);
    
    // Should have no errors
    assert.equal(result.error, null);
    
    // Should contain exactly D01 and D02 in order
    assert.equal(result.compatibleDishes.length, 2);
    assert.equal(result.compatibleDishes[0].id, 'D01');
    assert.equal(result.compatibleDishes[1].id, 'D02');
    
    // Check exclusion reasons exactly match the problem contract
    const d03 = result.excludedDishes.find(e => e.dish.id === 'D03');
    assert.deepEqual(d03.reasons, ['DIET:Asha', 'ALLERGEN:Mira:MILK']);
    
    const d04 = result.excludedDishes.find(e => e.dish.id === 'D04');
    assert.deepEqual(d04.reasons, ['ALLERGEN:Dev:PEANUT']);
    
    const d05 = result.excludedDishes.find(e => e.dish.id === 'D05');
    assert.deepEqual(d05.reasons, ['DIET:Asha', 'DIET:Dev']);
  });

  test('Budget Boundary Change (₹130) excludes D02', () => {
    const budget = 130;
    const result = calculateCompatibility(initialResidents, initialDishes, budget);
    
    assert.equal(result.error, null);
    
    // Only D01 should be compatible
    assert.equal(result.compatibleDishes.length, 1);
    assert.equal(result.compatibleDishes[0].id, 'D01');
    
    // D02 should now be excluded due to budget
    const d02 = result.excludedDishes.find(e => e.dish.id === 'D02');
    assert.ok(d02.reasons.includes('OVER_BUDGET'), 'D02 should have OVER_BUDGET reason');
  });

  test('Validation / Invalid Price Case', () => {
    const invalidDishes = deepClone(initialDishes);
    // Change D01 price to 0, which is invalid
    invalidDishes.find(d => d.id === 'D01').price = 0;
    
    const result = calculateCompatibility(initialResidents, invalidDishes, initialBudget);
    
    // Should trigger exact INVALID_INPUT error and clear results
    assert.equal(result.error, 'INVALID_INPUT');
    assert.equal(result.compatibleDishes.length, 0);
    assert.equal(result.excludedDishes.length, 0);
  });

  test('Duplicate Dish ID Case', () => {
    const duplicateDishes = deepClone(initialDishes);
    // Force D02 to have the same ID as D01
    duplicateDishes.find(d => d.id === 'D02').id = 'D01';
    
    const result = calculateCompatibility(initialResidents, duplicateDishes, initialBudget);
    
    // Should trigger exact DUPLICATE_DISH_ID error
    assert.equal(result.error, 'DUPLICATE_DISH_ID');
    assert.equal(result.compatibleDishes.length, 0);
    assert.equal(result.excludedDishes.length, 0);
  });
});
