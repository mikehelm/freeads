# Frontend Implementation Guide

## Project Overview
This guide details the implementation of the GetFreeAds frontend application, focusing on wallet data retrieval and display.

## Technology Stack
- Frontend: React + TypeScript + Vite
- State Management: React Hooks
- Styling: Tailwind CSS
- API Integration: REST API endpoints

## API Integration

### Wallet Data Endpoint
```typescript
interface WalletData {
  address: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  nickName?: string;
  country?: string;
  nodes: number;
  flipit: {
    nodes: number;
    email: string;
  };
}
```

### Error Handling
```typescript
interface ApiError {
  type: 'NOT_FOUND' | 'INVALID_ADDRESS' | 'CSV_ERROR' | 'NETWORK_ERROR' | 'VALIDATION_ERROR';
  message: string;
  details?: unknown;
}
```

## Development Setup

1. Install Dependencies:
```bash
npm install
```

2. Start Development Server:
```bash
npm run dev
```

The frontend will be available at [http://localhost:3000](http://localhost:3000)

## Environment Configuration

Create a `.env` file with:
```env
VITE_API_URL=http://localhost:4000  # Development
# VITE_API_URL=https://api.getfreeads.co  # Production
```

## Key Features
1. Ethereum wallet address validation
2. User data display
3. Error handling and user feedback
4. Responsive design

## Best Practices
1. Always validate Ethereum addresses
2. Handle all potential API errors
3. Provide clear user feedback
4. Maintain type safety
5. Follow React best practices

## Testing
Run tests with:
```bash
npm run test
```

Remember: Focus on clean UI/UX and proper error handling. The API handles the data processing - we just need to display it correctly.
