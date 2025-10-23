import 'dotenv/config';

import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { logger } from '../utils/logger.js';
import * as schema from './schema.js';

// Create database connection directly
const databaseUrl = process.env['DATABASE_URL'] || 'file:jobs.db';
logger.db.connecting(databaseUrl);

const client = createClient({
  url: databaseUrl,
});

logger.debug('Creating Drizzle database instance...');
const db = drizzle({ client, schema });

logger.db.connected();

// Export the database and client
export { db, client };
