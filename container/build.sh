#!/bin/bash
rm -rf point-label-sharing
git clone https://github.com/gtfierro/point-label-sharing
pushd point-label-sharing
git checkout add-scanner
cd frontend && npm install && npm run build
popd
docker build -t pointsharing .
echo -e "Run with\ndocker run -p 8080:8000 --rm pointsharing"
