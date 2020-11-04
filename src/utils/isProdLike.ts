export function isProdLike() {
  const environment = process.env.NODE_ENV;
  return (
    !!!environment || environment === 'prod' || environment === 'devsecure'
  );
}
