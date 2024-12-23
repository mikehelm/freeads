import { truncateAddress, validateAddress } from '../address';

describe('address utilities', () => {
  describe('truncateAddress', () => {
    it('should handle empty address', () => {
      expect(truncateAddress('')).toBe('');
    });

    it('should return full address if less than 11 characters', () => {
      expect(truncateAddress('1234567890')).toBe('1234567890');
    });

    it('should truncate long address correctly', () => {
      expect(truncateAddress('1234567890abcdef')).toBe('123456...cdef');
    });
  });

  describe('validateAddress', () => {
    it('should reject addresses shorter than 11 characters', () => {
      expect(validateAddress('1234567890')).toBe(false);
    });

    it('should reject addresses with special characters', () => {
      expect(validateAddress('1234!@#$%^&*()')).toBe(false);
    });

    it('should accept valid alphanumeric addresses', () => {
      expect(validateAddress('1234567890abcdef')).toBe(true);
    });
  });
});
