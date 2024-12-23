export function truncateAddress(address: string): string {
  if (!address) return '';
  if (address.length < 11) return address; // Return full address if too short
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function validateAddress(address: string): boolean {
  // Basic validation - address should be at least 11 characters
  // and should only contain alphanumeric characters
  return address.length >= 11 && /^[a-zA-Z0-9]+$/.test(address);
}
