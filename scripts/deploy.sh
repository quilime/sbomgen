#!/bin/sh
rm -rf dist
npm run build
rsync -var --delete dist/* syftrunner@sbomgen.com:/var/www/www.sbomgen.com/public/
rm -rf dist
