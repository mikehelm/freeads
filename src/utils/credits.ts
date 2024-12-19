import { NodeTransaction } from '../types/transactions';

export function calculateEligibleCredits(transactions: any[]): number {
  if (!transactions || transactions.length === 0) return 0;

  return transactions.reduce((total, tx) => {
    const price = parseFloat(tx.price);
    if (isNaN(price)) return total;
    // Cap credits at $1,000 per node
    const creditAmount = Math.min(price, 1000);
    return total + creditAmount;
  }, 0);
}