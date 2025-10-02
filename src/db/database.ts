import 'dotenv/config';

import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

// Create the database client
const client = createClient({
  url: process.env['DATABASE_URL'] || 'file:local.db',
});

// Create the Drizzle database instance
export const db = drizzle({ client });

// Export the client for migrations if needed
export { client };
