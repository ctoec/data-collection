import express, { json, Express } from 'express';
import path from 'path';
import httpProxy from 'http-proxy';

import { User } from '../entity';
import { isDevelopment } from './utils/isDevelopment';
import { handleError } from './middleware/error';
import { getManager } from 'typeorm';

const app = express();

app.use(json());

const apiRouter = express.Router();

app.use('/api', apiRouter);

const port = process.env.PORT || 3000;
app.listen(port);

/********** set up functions ***********/
const seedData = (app: Express) => {
  if (isDevelopment()) {
    const user = getManager().create(User, {
      id: 1,
      wingedKeysId: '2c0ec653-8829-4aa1-82ba-37c8832bbb88',
      firstName: 'Voldy',
      lastName: 'Mort',
    });
    getManager().save(user);
  }
};

const setUpErrorHandling = (app: Express) => {
  app.use('/api', handleError);
  app.use('/api', (_, res) => res.status(404));
};

const setUpSPAMiddleware = (app: Express) => {
  // serve static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // pass all fall-thru requests to client (index, or proxy if dev)
  if (!isDevelopment()) {
    app.get('*', (_, res) =>
      res.sendFile(path.join(__dirname, 'client/build/index.html'))
    );
  } else {
    const proxy = httpProxy.createProxy({
      target: process.env.CLIENT_URL || 'http://client:3000',
    });
    app.get('*', (req, res) => proxy.web(req, res));
  }
};
