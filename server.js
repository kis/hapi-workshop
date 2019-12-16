#!/usr/bin/env node
require('dotenv').config()

const createServer = require('./src/server');

createServer();