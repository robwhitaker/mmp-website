#!/bin/bash

echo "============================"
echo " BUILDING FOR: $ENV"
echo "============================"

git pull
bundle install
npm install
npm run bower install
if [ "$ENV" = "production" ]
    then
        ./node_modules/.bin/gulp build:reader --prod
    else
        npm run gulp build:reader
fi
npm run gulp build:editor
npm run gulp build:countdown
pumactl stop
pumactl start
