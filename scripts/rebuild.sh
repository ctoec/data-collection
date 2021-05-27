# Reinstall all dependencies and rebuild both client and server
# applications, specifically for local development

echo "Clearing out all old dependencies..."
cd ../
rm -rf node_modules
rm -rf dist

cd client
rm -rf node_modules
rm -rf build

echo "Installing client dependencies..."
yarn install --frozen-lockfile --network-concurrency 1

echo "Building the React app..."
yarn build

echo "Installing server dependencies..."
cd ../
yarn install --frozen-lockfile

echo "Building the Express server..."
yarn build