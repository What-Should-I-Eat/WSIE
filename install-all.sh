#!/bin/bash

npm install

pushd client
npm install
popd

pushd server
npm install
popd