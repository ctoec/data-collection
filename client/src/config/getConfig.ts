export async function getConfig(key: string) {
  const response = await fetch('/config.json');
  const config = await response.json();
  return config[key];
}
