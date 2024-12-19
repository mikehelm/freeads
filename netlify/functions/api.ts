import { Handler } from '@netlify/functions';
import express, { Router } from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import updateUserDetailsRoute from '../../src/server/routes/updateUserDetails';
import adminUpdateUserRoute from '../../src/server/routes/adminUpdateUser';

const api = express();

// Enable CORS
api.use(cors());
api.use(express.json());

// API routes
api.use(updateUserDetailsRoute);
api.use('/api/admin/update-user', adminUpdateUserRoute);

// Test route
api.get('/api/test', (req, res) => {
  res.json({ status: 'ok' });
});

// Wrap express app in serverless handler
const handler: Handler = serverless(api);
export { handler };
