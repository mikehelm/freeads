export interface Transaction {
  id: string;
  timestamp: number;
  from: string;
  to: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  type: 'credit' | 'debit';
}

export interface TransactionHistory {
  transactions: Transaction[];
  totalCredits: number;
  totalDebits: number;
}
