// db.js
import mysql from 'mysql2/promise';

export async function connectDB() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    database: 'root',
    user: 'root',
    password: 'root123',
    port: 3306,
  });

  return connection;
}
