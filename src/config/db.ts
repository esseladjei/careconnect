import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from '../entities/Users.js';

dotenv.config();
export const AppDataSource = new DataSource({
   type: 'postgres',
   host: process.env.POSTGRES_HOST,
   port: Number(process.env.POSTGRES_PORT),
   username: process.env.POSTGRES_USER,
   password: process.env.POSTGRES_PASS,
   database: process.env.POSTGRES_DB,
   synchronize: true, // Disable in production
   entities: [User],
});

