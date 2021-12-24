#!/bin/sh
npm run build
rsync -var dist/index.js package.json syftrunner@sbomgen.com:server/