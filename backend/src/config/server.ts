import {env} from 'config/env';

export const serverConfig = {
  port: env.PORT,
  baseUrl: env.BASE_URL,
  cors: {
    origin: '*',
  },
};
