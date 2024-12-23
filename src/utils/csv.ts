import { REQUIRED_CSV_COLUMNS, WalletData } from '../types/api';
import fs from 'fs';
import path from 'path';

export class CsvError extends Error {
  readonly __type = 'CsvError';

  constructor(message: string) {
    super(message);
    this.name = 'CsvError';
    Object.setPrototypeOf(this, CsvError.prototype);
  }
}

export function isCsvError(error: unknown): error is CsvError {
  return error instanceof Error && (error as any).__type === 'CsvError';
}

interface CSVRow {
  address: string;
  firstName: string;
  lastName: string;
  email: string;
  nickName: string;
  country: string;
  nodes: string;
}

export function readCsvData(filePath: string): WalletData[] {
  try {
    if (!fs.existsSync(filePath)) {
      throw new CsvError(`CSV file not found: ${filePath}`);
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8').toString();
    const lines = fileContent.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    validateCsvStructure(headers);

    const data = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return {
        address: row.address,
        firstName: row.firstName || undefined,
        lastName: row.lastName || undefined,
        email: row.email || undefined,
        nickName: row.nickName || undefined,
        country: row.country || undefined,
        nodes: parseInt(row.nodes || '0', 10),
        flipit: {
          nodes: 0,
          email: row.email || ''
        }
      } as WalletData;
    });

    return data;
  } catch (error) {
    if (error instanceof CsvError) {
      throw error;
    }
    throw new CsvError(error instanceof Error ? error.message : 'Unknown error reading CSV');
  }
}

export function validateCsvStructure(headers: string[]): void {
  const missingColumns = REQUIRED_CSV_COLUMNS.filter(
    col => !headers.includes(col)
  );

  if (missingColumns.length > 0) {
    throw new CsvError(
      `Missing required columns: ${missingColumns.join(', ')}`
    );
  }
}
