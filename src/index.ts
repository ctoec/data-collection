import express, { json } from 'express';
import path from 'path';
import httpProxy from 'http-proxy';
import { isDevelopment } from './utils/isDevelopment';
import api from './router/api';

// Create proxy for forwarding in development
const proxy = httpProxy.createProxy({
	target: 'http://client:3000'
});

// Instantiate the application server
const app = express();

// Register pre-processing middlewares
app.use(json());

/* Register the API middleware */
app.use('/api', api);

/* Register SPA-serving middlewares */
// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Handles any requests that don't match the ones above
if (!isDevelopment()) {
	// Register the fallback route to index.html
	app.get('*', (_, res) => 
		res.sendFile(path.join(__dirname, 'client/build/index.html'))
	);
} else {
	// When in development, proxy requests to the docker container for the client
	app.get('*', (req, res) => proxy.web(req, res));
}

const port = process.env.PORT || 3000;
app.listen(port);

console.log('App is listening on port ' + port);
