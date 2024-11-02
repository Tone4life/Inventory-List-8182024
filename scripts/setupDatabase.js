import pkg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);

const { Client } = pkg;

// Get the directory name of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = new Client({
    user: process.env.DB_USER,
    host: 'localhost',
    database: 'postgres',
    password: process.env.DB_PASSWORD,
    port: 5432,
});

async function setupDatabase() {
    try {
        await client.connect();
        await client.query('CREATE DATABASE inventory_db');
        console.log('Database created successfully');

        // Connect to the new database
        await client.end();
        client.database = 'inventory_db';
        await client.connect();

        // Read and execute the SQL file
        const sql = fs.readFileSync(path.join(__dirname, '../inventory_schema.sql')).toString();
        await client.query(sql);
        console.log('Schema created and data inserted successfully');
    } catch (error) {
        console.error('Error setting up database:', error);
    } finally {
        await client.end();
    }
}

setupDatabase();