export function isDevelopment() {
  const environment = process.env.NODE_ENV;
  return !environment || environment === 'development';
}
