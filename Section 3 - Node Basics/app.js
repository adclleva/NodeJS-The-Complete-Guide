// http is a global module
const http = require("http");

// server callback function
const server = http.createServer((req, res) => {
  const url = req.url;
  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>My First Page</title></head>");
    res.write(`
      <body>
        <form action="/message" method="POST">
          <input type="text" name="message">
            <button type="submit">Send</button>
          </input>
        </form>
      </body>`);
    res.write("</html>");
    return res.end();
  }

  // the req is a huge complex object that is sent to the server
  // console.log("req", req);
  console.log("url", req.url);
  console.log("method", req.method);
  console.log("headers", req.headers);

  console.log("");
  // this exits the event loop of the server and kills the server
  // process.exit();

  res.setHeader("Content-Type", "text/html");

  // this is the long way of writing html
  res.write("<html>");
  res.write("<head><title>My First Page</title></head>");
  res.write("<body><h1>Hello from my Node.js Server!</h1></body>");
  res.write("</html>");
  res.end(); // this is needed to send back to the client to know that it is done
});

server.listen(3000);
