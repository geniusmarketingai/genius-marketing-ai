import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema';

// Initialize Postgres client with the connection string
const connectionString = process.env.DATABASE_URL || '';
const client = postgres(connectionString);

// Initialize Drizzle with the client and schema
export const db = drizzle(client, { schema });