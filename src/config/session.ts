// session.config.ts
import * as session from 'express-session';
import { mongooseConfig } from './mongoose';
import MongoStore from 'connect-mongo';
import * as connectMongoDBSession from 'connect-mongodb-session';
import config from '../config';

const MongoDBStore = connectMongoDBSession(session);

const store = new MongoDBStore({
  uri: config.db.uri,
  collection: 'sessions',
});

export const sessionConfig = session({
  secret: 'BookingTest',
  resave: false,
  saveUninitialized: false,
  store: store,
});
