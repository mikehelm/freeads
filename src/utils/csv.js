"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvError = void 0;
exports.validateCsvStructure = validateCsvStructure;
exports.ensureCsvFile = ensureCsvFile;
exports.parseCsvLine = parseCsvLine;
exports.readCsvData = readCsvData;
const api_1 = require("../types/api");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class CsvError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CsvError';
    }
}
exports.CsvError = CsvError;
function validateCsvStructure(headers) {
    const missingColumns = api_1.REQUIRED_CSV_COLUMNS.filter(col => !headers.includes(col));
    if (missingColumns.length > 0) {
        throw new CsvError(`Missing required columns: ${missingColumns.join(', ')}`);
    }
}
function ensureCsvFile(filePath) {
    const dir = path_1.default.dirname(filePath);
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
    if (!fs_1.default.existsSync(filePath)) {
        const headers = api_1.REQUIRED_CSV_COLUMNS.join(',');
        fs_1.default.writeFileSync(filePath, `${headers}\n`, 'utf8');
    }
}
function parseCsvLine(line, headers) {
    const values = line.split(',');
    const data = {};
    headers.forEach((header, index) => {
        const value = values[index]?.trim() || '';
        if (header === 'nodes') {
            data[header] = parseInt(value) || 0;
        }
        else if (header === 'address') {
            data[header] = value.toLowerCase();
        }
        else {
            data[header] = value;
        }
    });
    return data;
}
function readCsvData(filePath) {
    const content = fs_1.default.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',');
    validateCsvStructure(headers);
    return lines.slice(1).map(line => {
        const data = parseCsvLine(line, headers);
        return {
            address: data.address || '',
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            nickName: data.nickName,
            country: data.country,
            nodes: data.nodes || 0,
            flipit: {
                nodes: 0,
                email: data.email || ''
            }
        };
    });
}
