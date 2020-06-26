export function getCurrentHost() {
	const location = window.location;
	const port = location.port;
	return `${location.protocol}//${location.hostname}${port ? `:${port}` : ''}`;
}
