import { Transaction } from '../types/transactions';

export function calculateEligibleCredits(transactions: Transaction[]): number {
  if (!transactions || transactions.length === 0) return 0;

  return transactions.reduce((total, tx) => {
    if (tx.type !== 'credit') return total;
    return total + Math.min(tx.amount, 1000);
  }, 0);
}