/**
 * Color Utilities Tests
 */

import {
  getRelativeLuminance,
  getContrastRatio,
  meetsWCAGAA,
  meetsWCAGAAA,
} from './colorUtils';

describe('Color Utilities', () => {
  describe('getRelativeLuminance', () => {
    it('should calculate luminance for white', () => {
      const luminance = getRelativeLuminance('#FFFFFF');
      expect(luminance).toBeCloseTo(1, 2);
    });

    it('should calculate luminance for black', () => {
      const luminance = getRelativeLuminance('#000000');
      expect(luminance).toBeCloseTo(0, 2);
    });

    it('should handle colors with # prefix', () => {
      const lum1 = getRelativeLuminance('#FF0000');
      const lum2 = getRelativeLuminance('FF0000');
      expect(lum1).toBe(lum2);
    });
  });

  describe('getContrastRatio', () => {
    it('should calculate contrast ratio between black and white', () => {
      const ratio = getContrastRatio('#000000', '#FFFFFF');
      expect(ratio).toBeCloseTo(21, 1);
    });

    it('should calculate contrast ratio between same colors as 1', () => {
      const ratio = getContrastRatio('#FF0000', '#FF0000');
      expect(ratio).toBeCloseTo(1, 2);
    });

    it('should be symmetric (order should not matter)', () => {
      const ratio1 = getContrastRatio('#000000', '#FFFFFF');
      const ratio2 = getContrastRatio('#FFFFFF', '#000000');
      expect(ratio1).toBe(ratio2);
    });
  });

  describe('meetsWCAGAA', () => {
    it('should pass for black text on white background (normal text)', () => {
      expect(meetsWCAGAA('#000000', '#FFFFFF', false)).toBe(true);
    });

    it('should pass for black text on white background (large text)', () => {
      expect(meetsWCAGAA('#000000', '#FFFFFF', true)).toBe(true);
    });

    it('should fail for light gray on white (normal text)', () => {
      expect(meetsWCAGAA('#CCCCCC', '#FFFFFF', false)).toBe(false);
    });

    it('should pass for medium gray on white (large text)', () => {
      expect(meetsWCAGAA('#767676', '#FFFFFF', true)).toBe(true);
    });

    it('should validate design system colors', () => {
      // Soft black on soft cream
      expect(meetsWCAGAA('#2C2C2C', '#FFFDF8', false)).toBe(true);
      
      // Medium gray on soft cream
      expect(meetsWCAGAA('#6B6B6B', '#FFFDF8', false)).toBe(true);
    });
  });

  describe('meetsWCAGAAA', () => {
    it('should pass for black text on white background', () => {
      expect(meetsWCAGAAA('#000000', '#FFFFFF', false)).toBe(true);
    });

    it('should have stricter requirements than AA', () => {
      // A color that passes AA but not AAA
      const passesAA = meetsWCAGAA('#767676', '#FFFFFF', false);
      const passesAAA = meetsWCAGAAA('#767676', '#FFFFFF', false);
      
      expect(passesAA).toBe(true);
      expect(passesAAA).toBe(false);
    });
  });
});
