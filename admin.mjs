import AdminJS from 'adminjs';
import mongoose from 'mongoose';
import AdminJSExpress from '@adminjs/express';
import { Database, Resource } from '@adminjs/mongoose';
import Dev from './models/dev.js';
import DASH from './models/dashboards.js';
import REQ from './models/requests.js';
import User from './models/user.js';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

AdminJS.registerAdapter({
  Database,
  Resource,
});

const DEFAULT_ADMIN = {
  email: process.env.ADMIN_MAIL,
  password: process.env.ADMIN_PASS,
};

const authenticate = async (email, password) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};
await mongoose.connect('mongodb://localhost:27017/DataSparkStudio');
const admin = new AdminJS({
  resources: [
    Dev,
    DASH,
    REQ,
    User,
  ],
  rootPath: '/admin',
  authenticate,
  cookieName: 'adminjs',
  cookiePassword: 'sessionsecret',
});

const app = express();

const adminRouter = AdminJSExpress.buildAuthenticatedRouter(admin, {
  authenticate,
  cookieName: 'adminjs',
  cookiePassword: 'sessionsecret',
});

app.use(admin.options.rootPath, adminRouter);

export { admin, app }; 
