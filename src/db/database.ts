import 'dotenv/config';

import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema.js';

// Create database connection directly
console.log('Creating database client...');
const client = createClient({
  url: process.env['DATABASE_URL'] || 'file:jobs.db',
});

console.log('Creating Drizzle database instance...');
const db = drizzle({ client, schema });

// Export the database and client
export { db, client };
