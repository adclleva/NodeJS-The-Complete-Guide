// this file just spins up the server

// http is a global module
const http = require("http");

const express = require("express");

const app = express();

// server callback function
const server = http.createServer(app);

server.listen(3000);
