export const env = {
  NODE_ENV: process.env.NODE_ENV || 'dev',
  PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
  BASE_URL: process.env.BASE_URL || 'http://localhost:3000',


};
