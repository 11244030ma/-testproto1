/**
 * Validation Utilities
 * 
 * Utilities for form validation
 */

/**
 * Validate email address format
 * @param email - Email address to validate
 * @returns true if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validate phone number format
 * Accepts various formats: (123) 456-7890, 123-456-7890, 1234567890
 * @param phone - Phone number to validate
 * @returns true if phone is valid
 */
export const isValidPhone = (phone: string): boolean => {
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Check if it has 10 or 11 digits (with or without country code)
  return digitsOnly.length === 10 || digitsOnly.length === 11;
};

/**
 * Validate US zip code format
 * Accepts 5-digit or 9-digit (ZIP+4) formats
 * @param zipCode - Zip code to validate
 * @returns true if zip code is valid
 */
export const isValidZipCode = (zipCode: string): boolean => {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zipCode.trim());
};

/**
 * Validate that a string is not empty or only whitespace
 * @param value - String to validate
 * @returns true if string has non-whitespace content
 */
export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Validate address object has all required fields
 * @param address - Address object to validate
 * @returns true if address is complete
 */
export const isValidAddress = (address: {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}): boolean => {
  return (
    isNotEmpty(address.street || '') &&
    isNotEmpty(address.city || '') &&
    isNotEmpty(address.state || '') &&
    isValidZipCode(address.zipCode || '')
  );
};

/**
 * Format phone number for display
 * Converts 1234567890 to (123) 456-7890
 * @param phone - Phone number to format
 * @returns formatted phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  const digitsOnly = phone.replace(/\D/g, '');
  
  if (digitsOnly.length === 10) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
  } else if (digitsOnly.length === 11) {
    return `+${digitsOnly[0]} (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7)}`;
  }
  
  return phone;
};

/**
 * Format price for display
 * Converts 12.5 to $12.50
 * @param price - Price to format
 * @returns formatted price string
 */
export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};
/**
 * Validate credit card number using Luhn algorithm
 * @param cardNumber - Card number to validate (with or without spaces)
 * @returns true if card number is valid
 */
export const isValidCardNumber = (cardNumber: string): boolean => {
  const number = cardNumber.replace(/\s/g, '');
  
  // Check if it's all digits and has reasonable length
  if (!/^\d{13,19}$/.test(number)) {
    return false;
  }
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

/**
 * Validate expiry date format and ensure it's not expired
 * @param expiryDate - Expiry date in MM/YY format
 * @returns true if expiry date is valid and not expired
 */
export const isValidExpiryDate = (expiryDate: string): boolean => {
  const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  
  if (!expiryRegex.test(expiryDate)) {
    return false;
  }
  
  const [month, year] = expiryDate.split('/');
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
  const currentMonth = currentDate.getMonth() + 1; // getMonth() is 0-indexed
  
  const expMonth = parseInt(month);
  const expYear = parseInt(year);
  
  // Check if the card is expired
  if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
    return false;
  }
  
  return true;
};

/**
 * Validate CVV format
 * @param cvv - CVV to validate
 * @returns true if CVV is valid (3 or 4 digits)
 */
export const isValidCVV = (cvv: string): boolean => {
  const cvvRegex = /^\d{3,4}$/;
  return cvvRegex.test(cvv);
};

/**
 * Format card number for display with spaces
 * Converts 1234567890123456 to 1234 5678 9012 3456
 * @param cardNumber - Card number to format
 * @returns formatted card number
 */
export const formatCardNumber = (cardNumber: string): string => {
  const number = cardNumber.replace(/\s/g, '');
  const formatted = number.replace(/(.{4})/g, '$1 ').trim();
  return formatted;
};

/**
 * Format expiry date for display
 * Converts 1225 to 12/25
 * @param expiryDate - Expiry date to format
 * @returns formatted expiry date
 */
export const formatExpiryDate = (expiryDate: string): string => {
  const digits = expiryDate.replace(/\D/g, '');
  
  if (digits.length >= 2) {
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
  }
  
  return digits;
};