import express, { json } from 'express';
import path from 'path';
import httpProxy from 'http-proxy';
import { isDevelopment } from './utils/isDevelopment';
import { handleError } from './middleware/error/handleError';
import { createConnection, getManager } from 'typeorm';
import { User } from './entity';
import { router as apiRouter } from './routes';

createConnection()
  .then(async () => {
    console.log('Successfully established TypeORM DB connection');

    if (isDevelopment()) {
      // set up user!
      const user = getManager().create(User, {
        id: 1,
        wingedKeysId: '2c0ec653-8829-4aa1-82ba-37c8832bbb88',
        firstName: 'Voldy',
        lastName: 'Mort',
      });
      getManager().save(user);
    }

    // Instantiate the application server
    const app = express();

    // Register pre-processing middlewares
    app.use(json());

    // Register business logic routes
    app.use('/api', apiRouter);

    // Handle errors
    app.use('/api', handleError);

    // Handle non-existant API routes
    app.use('/api', (_, res) => res.sendStatus(400));

    /* Register SPA-serving middlewares */
    // Serve the static files from the React app
    app.use(express.static(path.join(__dirname, '../client/build')));

    // Handles any requests that don't match the ones above
    if (!isDevelopment()) {
      // Register the fallback route to index.html
      app.get('*', (_, res) =>
        res.sendFile(path.join(__dirname, '../../client/build/index.html'))
      );
    } else {
      // When in development, proxy requests to the docker container for the client
      const proxy = httpProxy.createProxy({
        target: process.env.CLIENT_URL || 'http://client:3000',
      });
      app.get('*', (req, res) => proxy.web(req, res));
    }

    const port = process.env.PORT || 3000;
    app.listen(port);

    console.log('App is listening on port ' + port);
  })
  .catch((err) => console.error('error connecting to DB with typeorm', err));
