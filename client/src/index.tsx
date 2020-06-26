import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/App/App';
import * as serviceWorker from './serviceWorker';

const render = (Component: React.FC) => (
	ReactDOM.render(
		<React.StrictMode>
			<Component />
		</React.StrictMode>,
		document.getElementById('root')
	)
);

render(App);

// @ts-ignore
if (module.hot) {
	// @ts-ignore
	module.hot.accept('./containers/App/App', () => {
		const NextApp = require('./containers/App/App').default;
		render(NextApp);
	});
}


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
