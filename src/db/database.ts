import 'dotenv/config';

import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema.js';

// Lazy-loaded database connection
let _client: ReturnType<typeof createClient> | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

function getClient() {
  if (!_client) {
    console.log('Creating database client...');
    _client = createClient({
      url: process.env['DATABASE_URL'] || 'file:jobs.db',
    });
  }
  return _client;
}

function getDb() {
  if (!_db) {
    console.log('Creating Drizzle database instance...');
    _db = drizzle({ client: getClient(), schema });
  }
  return _db;
}

// Export lazy-loaded instances
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    return getDb()[prop as keyof ReturnType<typeof drizzle>];
  },
});

// Export the client for migrations if needed
export const client = new Proxy({} as ReturnType<typeof createClient>, {
  get(_target, prop) {
    return getClient()[prop as keyof ReturnType<typeof createClient>];
  },
});
