import { initializeDatabase } from '../lib/db';

async function main() {
  try {
    await initializeDatabase();
    console.log('Database initialization complete.');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

main();