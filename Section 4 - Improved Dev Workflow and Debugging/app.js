// this file just spins up the server

// http is a global module
const http = require("http");
const routes = require("./routes");

console.log(routes.someText);

// server callback function
const server = http.createServer(routes.handler);

server.listen(3000);
