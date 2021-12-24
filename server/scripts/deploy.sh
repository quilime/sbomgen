#!/bin/sh
npm run compile
rsync -var dist/index.js package.json syftrunner@sbomgen.com:server/