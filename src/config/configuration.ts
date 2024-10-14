import * as dotenv from 'dotenv';

dotenv.config()

export default () => ({
  port: parseInt(process.env.PORT, 10),
  database: {
    uri: process.env.MONGO_URI,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
});
