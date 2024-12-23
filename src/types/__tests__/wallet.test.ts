import { validateEmail, validateWalletData, WalletData } from '../wallet';

describe('wallet validation', () => {
  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@example.co.uk')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('test@example')).toBe(false);
      expect(validateEmail('test.example.com')).toBe(false);
    });
  });

  describe('validateWalletData', () => {
    const validWallet: WalletData = {
      address: '1234567890abcdef',
      email: 'test@example.com',
      nodes: 10,
      level: 1,
      flipit: {
        nodes: 5,
        email: 'flipit@example.com'
      }
    };

    it('should validate a complete valid wallet', () => {
      const result = validateWalletData(validWallet);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should require address', () => {
      const invalidWallet = { ...validWallet, address: '' };
      const result = validateWalletData(invalidWallet);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Address is required');
    });

    it('should validate email format if provided', () => {
      const invalidWallet = { ...validWallet, email: 'invalid-email' };
      const result = validateWalletData(invalidWallet);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid email format');
    });

    it('should validate flipit data if provided', () => {
      const invalidWallet = {
        ...validWallet,
        flipit: {
          nodes: -1,
          email: 'invalid-email'
        }
      };
      const result = validateWalletData(invalidWallet);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid Flipit email format');
      expect(result.errors).toContain('Invalid Flipit nodes value');
    });

    it('should validate numeric fields', () => {
      const invalidWallet = {
        ...validWallet,
        nodes: -1,
        level: -1
      };
      const result = validateWalletData(invalidWallet);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid nodes value');
      expect(result.errors).toContain('Invalid level value');
    });
  });
});
