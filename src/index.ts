import express, { json } from 'express';
import path from 'path';
import httpProxy from 'http-proxy';
import { isDevelopment } from './utils/isDevelopment';
import api from './router/api';
import { Client } from 'node-postgres';

// Create proxy for forwarding in development
const proxy = httpProxy.createProxy({
	target: 'http://client:3000'
});

// Create & connect a postgres client
const clientConfig = {
	user: process.env.DB_USER || 'postgres',
	password: process.env.DB_PASSWORD,
	host: process.env.DB_HOST || 'db',
	port: parseInt(process.env.DB_PORT) || 5432,
	database: process.env.DB_DB || 'postgres',
};
const client = new Client(clientConfig);
client.connect()
	.then(() => 
 		client.query('SELECT NOW() as now')
			.then((res) => console.log("DB connected successfully at", res.rows[0].now))
			.catch((err) => console.error("error querying client:", err))
	)
	.catch((err) => console.error("error connecting to client:", err));

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
