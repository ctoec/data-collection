echo "Clearing out all old dependencies..."
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