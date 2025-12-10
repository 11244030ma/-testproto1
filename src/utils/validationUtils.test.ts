/**
 * Validation Utilities Tests
 */

import {
  isValidEmail,
  isValidPhone,
  isValidZipCode,
  isNotEmpty,
  isValidAddress,
  formatPhoneNumber,
  formatPrice,
  isValidCardNumber,
  isValidExpiryDate,
  isValidCVV,
  formatCardNumber,
  formatExpiryDate,
} from './validationUtils';

describe('Validation Utilities', () => {
  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('invalid@.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });

    it('should trim whitespace', () => {
      expect(isValidEmail('  test@example.com  ')).toBe(true);
    });
  });

  describe('isValidPhone', () => {
    it('should validate 10-digit phone numbers', () => {
      expect(isValidPhone('1234567890')).toBe(true);
      expect(isValidPhone('(123) 456-7890')).toBe(true);
      expect(isValidPhone('123-456-7890')).toBe(true);
    });

    it('should validate 11-digit phone numbers (with country code)', () => {
      expect(isValidPhone('11234567890')).toBe(true);
      expect(isValidPhone('+1 (123) 456-7890')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhone('123')).toBe(false);
      expect(isValidPhone('12345')).toBe(false);
      expect(isValidPhone('')).toBe(false);
    });
  });

  describe('isValidZipCode', () => {
    it('should validate 5-digit zip codes', () => {
      expect(isValidZipCode('12345')).toBe(true);
      expect(isValidZipCode('90210')).toBe(true);
    });

    it('should validate ZIP+4 format', () => {
      expect(isValidZipCode('12345-6789')).toBe(true);
    });

    it('should reject invalid zip codes', () => {
      expect(isValidZipCode('1234')).toBe(false);
      expect(isValidZipCode('123456')).toBe(false);
      expect(isValidZipCode('abcde')).toBe(false);
      expect(isValidZipCode('')).toBe(false);
    });
  });

  describe('isNotEmpty', () => {
    it('should return true for non-empty strings', () => {
      expect(isNotEmpty('hello')).toBe(true);
      expect(isNotEmpty('a')).toBe(true);
    });

    it('should return false for empty or whitespace strings', () => {
      expect(isNotEmpty('')).toBe(false);
      expect(isNotEmpty('   ')).toBe(false);
      expect(isNotEmpty('\t\n')).toBe(false);
    });
  });

  describe('isValidAddress', () => {
    it('should validate complete addresses', () => {
      const address = {
        street: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94102',
      };
      expect(isValidAddress(address)).toBe(true);
    });

    it('should reject incomplete addresses', () => {
      expect(isValidAddress({ street: '123 Main St' })).toBe(false);
      expect(isValidAddress({ city: 'San Francisco' })).toBe(false);
      expect(isValidAddress({})).toBe(false);
    });

    it('should reject addresses with invalid zip codes', () => {
      const address = {
        street: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: 'invalid',
      };
      expect(isValidAddress(address)).toBe(false);
    });
  });

  describe('formatPhoneNumber', () => {
    it('should format 10-digit phone numbers', () => {
      expect(formatPhoneNumber('1234567890')).toBe('(123) 456-7890');
    });

    it('should format 11-digit phone numbers', () => {
      expect(formatPhoneNumber('11234567890')).toBe('+1 (123) 456-7890');
    });

    it('should handle already formatted numbers', () => {
      expect(formatPhoneNumber('(123) 456-7890')).toBe('(123) 456-7890');
    });

    it('should return original for invalid lengths', () => {
      expect(formatPhoneNumber('123')).toBe('123');
    });
  });

  describe('formatPrice', () => {
    it('should format prices with two decimal places', () => {
      expect(formatPrice(12.5)).toBe('$12.50');
      expect(formatPrice(100)).toBe('$100.00');
      expect(formatPrice(9.99)).toBe('$9.99');
    });

    it('should handle zero', () => {
      expect(formatPrice(0)).toBe('$0.00');
    });

    it('should round to two decimal places', () => {
      expect(formatPrice(12.345)).toBe('$12.35');
      expect(formatPrice(12.344)).toBe('$12.34');
    });
  });

  describe('isValidCardNumber', () => {
    it('should validate correct card numbers', () => {
      expect(isValidCardNumber('4242424242424242')).toBe(true); // Visa test card
      expect(isValidCardNumber('4242 4242 4242 4242')).toBe(true); // With spaces
      expect(isValidCardNumber('5555555555554444')).toBe(true); // Mastercard test card
    });

    it('should reject invalid card numbers', () => {
      expect(isValidCardNumber('1234567890123456')).toBe(false); // Invalid Luhn
      expect(isValidCardNumber('123')).toBe(false); // Too short
      expect(isValidCardNumber('12345678901234567890')).toBe(false); // Too long
      expect(isValidCardNumber('abcd1234567890123')).toBe(false); // Contains letters
    });
  });

  describe('isValidExpiryDate', () => {
    it('should validate correct expiry dates', () => {
      const futureYear = (new Date().getFullYear() + 2) % 100;
      expect(isValidExpiryDate(`12/${futureYear.toString().padStart(2, '0')}`)).toBe(true);
      expect(isValidExpiryDate('01/30')).toBe(true); // Far future
    });

    it('should reject invalid expiry dates', () => {
      expect(isValidExpiryDate('13/25')).toBe(false); // Invalid month
      expect(isValidExpiryDate('00/25')).toBe(false); // Invalid month
      expect(isValidExpiryDate('12/20')).toBe(false); // Past year
      expect(isValidExpiryDate('1225')).toBe(false); // Wrong format
      expect(isValidExpiryDate('12/2025')).toBe(false); // 4-digit year
    });
  });

  describe('isValidCVV', () => {
    it('should validate correct CVV codes', () => {
      expect(isValidCVV('123')).toBe(true);
      expect(isValidCVV('1234')).toBe(true); // Amex
    });

    it('should reject invalid CVV codes', () => {
      expect(isValidCVV('12')).toBe(false); // Too short
      expect(isValidCVV('12345')).toBe(false); // Too long
      expect(isValidCVV('abc')).toBe(false); // Contains letters
    });
  });

  describe('formatCardNumber', () => {
    it('should format card numbers with spaces', () => {
      expect(formatCardNumber('1234567890123456')).toBe('1234 5678 9012 3456');
      expect(formatCardNumber('1234 5678 9012 3456')).toBe('1234 5678 9012 3456'); // Already formatted
    });

    it('should handle partial card numbers', () => {
      expect(formatCardNumber('1234')).toBe('1234');
      expect(formatCardNumber('12345678')).toBe('1234 5678');
    });
  });

  describe('formatExpiryDate', () => {
    it('should format expiry dates with slash', () => {
      expect(formatExpiryDate('1225')).toBe('12/25');
      expect(formatExpiryDate('12/25')).toBe('12/25'); // Already formatted
    });

    it('should handle partial expiry dates', () => {
      expect(formatExpiryDate('1')).toBe('1');
      expect(formatExpiryDate('12')).toBe('12/');
    });
  });
});
