#!/bin/bash

cd ./config || exit
webpack-dev-server --config webpack.client.js --mode development