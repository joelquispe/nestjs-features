// export default () => ({
//   port: parseInt(process.env.PORT, 10) || 3000,
//   jwtSecret: process.env.JWT_SECRET,
//   name: 'joel',
//   database: {
//     host: process.env.DB_HOST,
//     port: parseInt(process.env.DB_PORT, 10) || 3306,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     rootPassword: process.env.DB_ROOT_PASSWORD,
//     name: process.env.DB_NAME,
//     mongo_uri: process.env.MONGO_URI,
//   },
// });

import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  jwtSecret: process.env.JWT_SECRET,
  name: 'joel',
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    rootPassword: process.env.DB_ROOT_PASSWORD,
    name: process.env.DB_NAME,
    mongo_uri: process.env.MONGO_URI,
  },
}));
