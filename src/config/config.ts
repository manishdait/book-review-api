import dotenv from 'dotenv';

dotenv.config();

export const Config = {
  PORT: process.env.SERVER_PORT || 3000,
  DB_URL: process.env.DATASOURCE_URL || '',
  ACCESS_TOKEN_KEY: process.env.ACCESS_TOKEN_KEY
}
