import sql from 'mssql';

// Azure SQL Server configuration
const config: sql.config = {
  server: 'aidenvision-dev.database.windows.net',
  user: 'testsql',
  password: 'testtest@123',
  database: 'AidenVisionDevDB',
  options: {
    encrypt: true, // Use encryption
    trustServerCertificate: false, // Do not trust self-signed certificates
    enableArithAbort: true,
    connectTimeout: 30000,
    requestTimeout: 30000,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

// Create connection pool
let pool: sql.ConnectionPool | null = null;

// Get database connection pool
export async function getPool(): Promise<sql.ConnectionPool> {
  if (!pool) {
    pool = await sql.connect(config);
    console.log('Connected to Azure SQL Database');
  }
  return pool;
}

// Helper function to run migrations or initial setup
export async function initializeDatabase() {
  try {
    const pool = await getPool();
    const request = pool.request();

    // Create a simple users table as an example (only if it doesn't exist)
    // const createUsersTable = `
    //   IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
    //   CREATE TABLE users (
    //     id INT IDENTITY(1,1) PRIMARY KEY,
    //     name NVARCHAR(255) NOT NULL,
    //     email NVARCHAR(255) UNIQUE NOT NULL,
    //     created_at DATETIME2 DEFAULT GETDATE()
    //   )
    // `;

    // await request.query(createUsersTable);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

// Close database connection on process exit
process.on('exit', async () => {
  if (pool) {
    await pool.close();
  }
});
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', async () => {
  if (pool) {
    await pool.close();
  }
  process.exit(128 + 2);
});
process.on('SIGTERM', async () => {
  if (pool) {
    await pool.close();
  }
  process.exit(128 + 15);
});