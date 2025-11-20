import 'dotenv/config';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
  try {
    const databaseUrl = process.env['DATABASE_URL'] || 'file:jobs.db';
    console.log(`[Setup] Connecting to database: ${databaseUrl}`);

    const client = createClient({
      url: databaseUrl,
    });

    const db = drizzle({ client });

    // Run migrations
    console.log('[Setup] Running migrations...');
    const migrationsFolder = path.join(__dirname, '../../drizzle/migrations');
    console.log(`[Setup] Migrations folder: ${migrationsFolder}`);

    if (!fs.existsSync(migrationsFolder)) {
      throw new Error(`Migrations folder not found: ${migrationsFolder}`);
    }

    await migrate(db, { migrationsFolder });
    console.log('[Setup] ✓ Migrations completed successfully');

    // Run seeds
    console.log('[Setup] Running seeds...');
    try {
      const seedPath = path.join(__dirname, '../seeds/index.js');
      if (fs.existsSync(seedPath)) {
        const { runAllSeeds } = await import('../seeds/index.js');
        await runAllSeeds();
        console.log('[Setup] ✓ Seeds completed successfully');
      } else {
        console.log('[Setup] No seeds found, skipping...');
      }
    } catch (error) {
      console.log('[Setup] Seeds not available or skipped:', (error as Error).message);
    }

    console.log('[Setup] ✓ Database setup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('[Setup] ✗ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
