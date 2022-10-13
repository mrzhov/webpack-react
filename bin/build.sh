#!/bin/bash

cd ./config || exit
webpack --config webpack.client.js --mode production