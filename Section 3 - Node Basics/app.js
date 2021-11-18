// http is a global module
const http = require("http");

// server callback function
const server = http.createServer((req, res) => {
  console.log("req", req);
});

server.listen(3000);
