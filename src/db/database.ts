import 'dotenv/config';

import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

import * as schema from './schema.js';

// Create the database client
const client = createClient({
  url: process.env['DATABASE_URL'] || 'file:local.db',
});

// Create the Drizzle database instance with schema
export const db = drizzle({ client, schema });

// Export the client for migrations if needed
export { client };
