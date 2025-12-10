/**
 * MenuItemDetail Component Property-Based Tests
 * Feature: premium-food-app, Property 19: Item details include complete information
 * Validates: Requirements 9.3
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import fc from 'fast-check';
import { MenuItemDetail } from './MenuItemDetail';
import { MenuItem } from '../types';

// Generator for realistic text content
const meaningfulStringArbitrary = fc.constantFrom(
  'Grilled Chicken Sandwich',
  'Margherita Pizza',
  'Caesar Salad',
  'Beef Burger',
  'Vegetable Stir Fry',
  'Fish Tacos',
  'Pasta Carbonara',
  'Thai Green Curry',
  'Chocolate Cake',
  'Fresh Fruit Bowl'
);

const descriptionArbitrary = fc.constantFrom(
  'A delicious and carefully prepared dish made with fresh ingredients',
  'Expertly crafted using traditional cooking methods and premium ingredients',
  'A flavorful combination of seasonal ingredients prepared to perfection',
  'Made with locally sourced ingredients and served with our signature sauce',
  'A classic recipe prepared with attention to detail and authentic flavors'
);

const allergenArbitrary = fc.constantFrom(
  'Peanuts', 'Tree Nuts', 'Dairy', 'Eggs', 'Soy', 'Wheat', 'Fish', 'Shellfish'
);

// Price generator using integer cents to avoid float precision issues
const priceArbitrary = fc.integer({ min: 1, max: 10000 }).map(cents => cents / 100);

const categoryArbitrary = fc.constantFrom('Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Salads');

// Generator for menu item data with complete information
const menuItemWithCompleteInfoArbitrary: fc.Arbitrary<MenuItem> = fc.record({
  id: fc.uuid(),
  restaurantId: fc.uuid(),
  name: meaningfulStringArbitrary,
  description: descriptionArbitrary,
  price: priceArbitrary,
  imageUrl: fc.webUrl(),
  category: categoryArbitrary,
  dietaryInfo: fc.record({
    isVegetarian: fc.boolean(),
    isVegan: fc.boolean(),
    isGlutenFree: fc.boolean(),
    allergens: fc.array(allergenArbitrary, { minLength: 1, maxLength: 3 }),
  }),
  nutritionalInfo: fc.record({
    calories: fc.integer({ min: 100, max: 2000 }),
    protein: fc.integer({ min: 5, max: 100 }),
    carbs: fc.integer({ min: 10, max: 200 }),
    fat: fc.integer({ min: 2, max: 100 }),
  }),
  isAvailable: fc.boolean(),
});

// Generator for menu item data with optional information
const menuItemArbitrary: fc.Arbitrary<MenuItem> = fc.record({
  id: fc.uuid(),
  restaurantId: fc.uuid(),
  name: meaningfulStringArbitrary,
  description: descriptionArbitrary,
  price: priceArbitrary,
  imageUrl: fc.webUrl(),
  category: categoryArbitrary,
  dietaryInfo: fc.record({
    isVegetarian: fc.boolean(),
    isVegan: fc.boolean(),
    isGlutenFree: fc.boolean(),
    allergens: fc.array(allergenArbitrary, { maxLength: 3 }),
  }),
  nutritionalInfo: fc.option(fc.record({
    calories: fc.integer({ min: 100, max: 2000 }),
    protein: fc.integer({ min: 5, max: 100 }),
    carbs: fc.integer({ min: 10, max: 200 }),
    fat: fc.integer({ min: 2, max: 100 }),
  }), { nil: undefined }),
  isAvailable: fc.boolean(),
});

describe('MenuItemDetail Property Tests', () => {
  const mockOnClose = jest.fn();
  const mockOnAddToCart = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Feature: premium-food-app, Property 19: Item details include complete information
  it('Property 19: Item details include complete information when nutritional info is available', () => {
    fc.assert(
      fc.property(menuItemWithCompleteInfoArbitrary, (menuItem) => {
        const { getByText, queryByText } = render(
          <MenuItemDetail
            menuItem={menuItem}
            isVisible={true}
            onClose={mockOnClose}
            onAddToCart={mockOnAddToCart}
          />
        );

        // Property: All essential item information should be displayed
        expect(getByText(menuItem.name)).toBeTruthy();
        expect(getByText(menuItem.description)).toBeTruthy();
        expect(getByText(`$${menuItem.price.toFixed(2)}`)).toBeTruthy();

        // Property: Nutritional information should be displayed when available
        if (menuItem.nutritionalInfo) {
          expect(getByText('Nutritional Information')).toBeTruthy();
          expect(getByText('Calories')).toBeTruthy();
          expect(getByText('Protein')).toBeTruthy();
          expect(getByText('Carbs')).toBeTruthy();
          expect(getByText('Fat')).toBeTruthy();
          
          // Check that nutritional values are present (may appear multiple times)
          const { getAllByText } = render(
            <MenuItemDetail
              menuItem={menuItem}
              isVisible={true}
              onClose={mockOnClose}
              onAddToCart={mockOnAddToCart}
            />
          );
          
          expect(getAllByText(menuItem.nutritionalInfo.calories.toString()).length).toBeGreaterThan(0);
          expect(getAllByText(`${menuItem.nutritionalInfo.protein}g`).length).toBeGreaterThan(0);
          expect(getAllByText(`${menuItem.nutritionalInfo.carbs}g`).length).toBeGreaterThan(0);
          expect(getAllByText(`${menuItem.nutritionalInfo.fat}g`).length).toBeGreaterThan(0);
        }

        // Property: Allergen information should be displayed when available
        if (menuItem.dietaryInfo.allergens && menuItem.dietaryInfo.allergens.length > 0) {
          expect(getByText('Allergen Information')).toBeTruthy();
          const allergenText = `Contains: ${menuItem.dietaryInfo.allergens.join(', ')}`;
          expect(getByText(allergenText)).toBeTruthy();
          expect(getByText(/Please inform your server of any allergies/)).toBeTruthy();
        }

        // Property: Dietary badges should be displayed when applicable
        if (menuItem.dietaryInfo.isVegetarian) {
          expect(getByText('Vegetarian')).toBeTruthy();
        }
        if (menuItem.dietaryInfo.isVegan) {
          expect(getByText('Vegan')).toBeTruthy();
        }
        if (menuItem.dietaryInfo.isGlutenFree) {
          expect(getByText('Gluten-Free')).toBeTruthy();
        }

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 19: Item details handle missing optional information gracefully', () => {
    fc.assert(
      fc.property(menuItemArbitrary, (menuItem) => {
        const { getByText, queryByText } = render(
          <MenuItemDetail
            menuItem={menuItem}
            isVisible={true}
            onClose={mockOnClose}
            onAddToCart={mockOnAddToCart}
          />
        );

        // Property: Essential information should always be present
        expect(getByText(menuItem.name)).toBeTruthy();
        expect(getByText(menuItem.description)).toBeTruthy();
        expect(getByText(`$${menuItem.price.toFixed(2)}`)).toBeTruthy();

        // Property: Optional sections should only appear when data is available
        if (!menuItem.nutritionalInfo) {
          expect(queryByText('Nutritional Information')).toBeNull();
        }

        if (!menuItem.dietaryInfo.allergens || menuItem.dietaryInfo.allergens.length === 0) {
          expect(queryByText('Allergen Information')).toBeNull();
        }

        // Property: Dietary badges should only appear when true
        if (!menuItem.dietaryInfo.isVegetarian) {
          expect(queryByText('Vegetarian')).toBeNull();
        }
        if (!menuItem.dietaryInfo.isVegan) {
          expect(queryByText('Vegan')).toBeNull();
        }
        if (!menuItem.dietaryInfo.isGlutenFree) {
          expect(queryByText('Gluten-Free')).toBeNull();
        }

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 19: Information is displayed in scannable format with clear sections', () => {
    fc.assert(
      fc.property(menuItemWithCompleteInfoArbitrary, (menuItem) => {
        const { getByText } = render(
          <MenuItemDetail
            menuItem={menuItem}
            isVisible={true}
            onClose={mockOnClose}
            onAddToCart={mockOnAddToCart}
          />
        );

        // Property: Section headers should be present for scannable format
        if (menuItem.nutritionalInfo) {
          expect(getByText('Nutritional Information')).toBeTruthy();
        }

        if (menuItem.dietaryInfo.allergens && menuItem.dietaryInfo.allergens.length > 0) {
          expect(getByText('Allergen Information')).toBeTruthy();
        }

        // Property: Nutritional information should be organized in a grid format
        if (menuItem.nutritionalInfo) {
          // All nutritional values should be present with their labels
          expect(getByText('Calories')).toBeTruthy();
          expect(getByText('Protein')).toBeTruthy();
          expect(getByText('Carbs')).toBeTruthy();
          expect(getByText('Fat')).toBeTruthy();
        }

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 19: Unavailable items display appropriate status', () => {
    fc.assert(
      fc.property(
        menuItemArbitrary.map(item => ({ ...item, isAvailable: false })),
        (menuItem) => {
          const { getByText, queryByText } = render(
            <MenuItemDetail
              menuItem={menuItem}
              isVisible={true}
              onClose={mockOnClose}
              onAddToCart={mockOnAddToCart}
            />
          );

          // Property: Unavailable items should show status message
          expect(getByText('Currently Unavailable')).toBeTruthy();

          // Property: Add to cart controls should not be present for unavailable items
          expect(queryByText(/Add.*to Cart/)).toBeNull();

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 19: All required information fields are accessible', () => {
    fc.assert(
      fc.property(menuItemWithCompleteInfoArbitrary, (menuItem) => {
        const { getByText, queryByText } = render(
          <MenuItemDetail
            menuItem={menuItem}
            isVisible={true}
            onClose={mockOnClose}
            onAddToCart={mockOnAddToCart}
          />
        );

        // Property: Core item information should be accessible
        const nameElement = getByText(menuItem.name);
        const descriptionElement = getByText(menuItem.description);
        const priceElement = getByText(`$${menuItem.price.toFixed(2)}`);

        expect(nameElement).toBeTruthy();
        expect(descriptionElement).toBeTruthy();
        expect(priceElement).toBeTruthy();

        // Property: Nutritional information should be accessible when present
        if (menuItem.nutritionalInfo) {
          // Check that nutritional labels are present
          expect(getByText('Calories')).toBeTruthy();
          expect(getByText('Protein')).toBeTruthy();
          expect(getByText('Carbs')).toBeTruthy();
          expect(getByText('Fat')).toBeTruthy();
          
          // Check that nutritional values are present using getAllByText (handles duplicates)
          const { getAllByText: getAllByTextForNutrition } = render(
            <MenuItemDetail
              menuItem={menuItem}
              isVisible={true}
              onClose={mockOnClose}
              onAddToCart={mockOnAddToCart}
            />
          );
          
          expect(getAllByTextForNutrition(menuItem.nutritionalInfo.calories.toString()).length).toBeGreaterThan(0);
          expect(getAllByTextForNutrition(`${menuItem.nutritionalInfo.protein}g`).length).toBeGreaterThan(0);
          expect(getAllByTextForNutrition(`${menuItem.nutritionalInfo.carbs}g`).length).toBeGreaterThan(0);
          expect(getAllByTextForNutrition(`${menuItem.nutritionalInfo.fat}g`).length).toBeGreaterThan(0);
        }

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 19: Allergen information is clearly communicated', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.uuid(),
          restaurantId: fc.uuid(),
          name: meaningfulStringArbitrary,
          description: descriptionArbitrary,
          price: priceArbitrary,
          imageUrl: fc.webUrl(),
          category: categoryArbitrary,
          dietaryInfo: fc.record({
            isVegetarian: fc.boolean(),
            isVegan: fc.boolean(),
            isGlutenFree: fc.boolean(),
            allergens: fc.array(allergenArbitrary, { minLength: 1, maxLength: 3 }),
          }),
          nutritionalInfo: fc.option(fc.record({
            calories: fc.integer({ min: 100, max: 2000 }),
            protein: fc.integer({ min: 5, max: 100 }),
            carbs: fc.integer({ min: 10, max: 200 }),
            fat: fc.integer({ min: 2, max: 100 }),
          }), { nil: undefined }),
          isAvailable: fc.boolean(),
        }),
        (menuItem) => {
          const { getByText } = render(
            <MenuItemDetail
              menuItem={menuItem}
              isVisible={true}
              onClose={mockOnClose}
              onAddToCart={mockOnAddToCart}
            />
          );

          // Property: Allergen section should be clearly labeled
          expect(getByText('Allergen Information')).toBeTruthy();

          // Property: Allergen list should be formatted clearly
          const allergenText = `Contains: ${menuItem.dietaryInfo.allergens.join(', ')}`;
          expect(getByText(allergenText)).toBeTruthy();

          // Property: Safety disclaimer should be present
          expect(getByText(/Please inform your server of any allergies/)).toBeTruthy();

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});