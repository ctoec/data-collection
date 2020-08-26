#!/bin/sh
# Manually install, build and deploy Fawkes to the specified stage

echo "Welcome to the deployment of..."
cat << "EOF"

  ______             _             _ 
 |  ____|           | |           | |
 | |__ __ ___      _| | _____  ___| |
 |  __/ _` \ \ /\ / / |/ / _ \/ __| |
 | | | (_| |\ V  V /|   <  __/\__ \_|
 |_|  \__,_| \_/\_/ |_|\_\___||___(_)


EOF

echo "Note that this script assumes you have yarn and the Elastic Beanstalk CLI installed on your machine."
echo "If you're missing either of those dependencies, please install them prior to executing this script."
echo "Also, ensure that your corresponding AWS credentials are set on the machine this is running on."
echo ""

if [[ "$1" != "qa" ]] && [[ "$1" != "staging" ]] && [[ "$1" != "devsecure" ]]
then
   echo "Please supply a valid environment to deploy to.";
   echo "Options are: 'qa', 'staging', 'devsecure'"
   echo 'Example: "./deploy.sh qa"'
   exit 1
fi

# This is a comment!
yarn install --frozen-lockfile
cd client && yarn install --frozen-lockfile --network-concurrency 1

# Build the React app and Express server
yarn build
cd ../ && yarn build

# Now just init and deploy!
eb init ece-fawkes-$1-app --region us-east-2 --platform node.js
eb deploy ece-fawkes-$1-env