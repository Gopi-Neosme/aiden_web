import sql from 'mssql';

// Azure SQL Server configuration
const config: sql.config = {
  server: 'aidenvision-dev.database.windows.net',
  user: 'testsqluser',
  password: 'testtest@123',
  database: 'AidenVisionDevDB',
  options: {
    encrypt: true, // Use encryption
    trustServerCertificate: false, // Do not trust self-signed certificates
    enableArithAbort: true,
    connectTimeout: 10000, // Reduced to 10 seconds
    requestTimeout: 15000, // Reduced to 15 seconds
    cancelTimeout: 5000, // Cancel query after 5 seconds
  },
  pool: {
    max: 20, // Increased pool size
    min: 2, // Keep minimum 2 connections
    idleTimeoutMillis: 60000, // Increased idle timeout
    acquireTimeoutMillis: 10000, // Timeout for acquiring connection
    createTimeoutMillis: 10000, // Timeout for creating connection
    destroyTimeoutMillis: 5000, // Timeout for destroying connection
    reapIntervalMillis: 1000, // Check for idle connections every second
    createRetryIntervalMillis: 200, // Retry connection creation every 200ms
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

    // Create widgets table for storing dashboard widgets
    const createWidgetsTable = `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='widgets' AND xtype='U')
      CREATE TABLE widgets (
        id NVARCHAR(255) PRIMARY KEY,
        user_id NVARCHAR(255) NOT NULL,
        type NVARCHAR(50) NOT NULL,
        title NVARCHAR(255) NOT NULL,
        badge NVARCHAR(50),
        icon NVARCHAR(50),
        layout NVARCHAR(MAX) NOT NULL, -- JSON string for layout
        props NVARCHAR(MAX), -- JSON string for widget properties
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE()
      )
    `;

    await request.query(createWidgetsTable);
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