// http is a global module
const http = require("http");

// server callback function
const server = http.createServer((req, res) => {
  // console.log("req", req);
  console.log("url", req.url);
  console.log("method", req.method);
  console.log("headers", req.headers);
  // this exits the event loop of the server and kills the server
  // process.exit();
});

server.listen(3000);
