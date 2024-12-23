export interface FlipitData {
  nodes: number;
  email: string;
}

export interface WalletData {
  id?: string;
  address: string;
  nodes?: number;
  email?: string;
  level?: number;
  flipit?: FlipitData;
  firstName?: string;
  lastName?: string;
  nickName?: string;
  country?: string;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateAddress(address: string): boolean {
  // Add address validation logic here
  // For demonstration purposes, a simple validation is used
  const addressRegex = /^[a-zA-Z0-9\s,.-]+$/;
  return addressRegex.test(address);
}

export function validateWalletData(wallet: Partial<WalletData>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required field validation
  if (!wallet.address) {
    errors.push('Address is required');
  } else if (!validateAddress(wallet.address)) {
    errors.push('Invalid address format');
  }

  // Email validation if provided
  if (wallet.email && !validateEmail(wallet.email)) {
    errors.push('Invalid email format');
  }

  // Name validations if provided
  if (wallet.firstName && (wallet.firstName.length < 2 || wallet.firstName.length > 50)) {
    errors.push('First name must be between 2 and 50 characters');
  }

  if (wallet.lastName && (wallet.lastName.length < 2 || wallet.lastName.length > 50)) {
    errors.push('Last name must be between 2 and 50 characters');
  }

  if (wallet.nickName && (wallet.nickName.length < 2 || wallet.nickName.length > 30)) {
    errors.push('Nickname must be between 2 and 30 characters');
  }

  // Country validation if provided
  if (wallet.country && wallet.country.length !== 2) {
    errors.push('Country must be a 2-letter ISO code');
  }

  // Flipit data validation if provided
  if (wallet.flipit) {
    if (!validateEmail(wallet.flipit.email)) {
      errors.push('Invalid Flipit email format');
    }
    if (typeof wallet.flipit.nodes !== 'number' || wallet.flipit.nodes < 0) {
      errors.push('Invalid Flipit nodes value');
    }
  }

  // Nodes validation if provided
  if (wallet.nodes !== undefined) {
    if (typeof wallet.nodes !== 'number' || wallet.nodes < 0) {
      errors.push('Invalid nodes value');
    }
    if (wallet.nodes > 1000000) {
      errors.push('Nodes value exceeds maximum limit');
    }
  }

  // Level validation if provided
  if (wallet.level !== undefined) {
    if (typeof wallet.level !== 'number' || wallet.level < 0) {
      errors.push('Invalid level value');
    }
    if (wallet.level > 100) {
      errors.push('Level value exceeds maximum limit');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
