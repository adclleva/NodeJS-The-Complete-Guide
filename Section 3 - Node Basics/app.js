// http is a global module
const http = require("http");
const fs = require("fs");

// server callback function
const server = http.createServer((request, response) => {
  const url = request.url;
  const method = request.method;
  if (url === "/") {
    response.write("<html>");
    response.write("<head><title>My First Page</title></head>");
    response.write(`
      <body>
        <form action="/message" method="POST">
          <input type="text" name="message">
            <button type="submit">Send</button>
          </input>
        </form>
      </body>`);
    response.write("</html>");
    return response.end();
  }

  if (url === "/message" && method === "POST") {
    fs.writeFileSync("message.txt", "DUMMY");

    response.statusCode = 302;
    // Location is the default header by the browser
    response.setHeader("Location", "/");
    return response.end();
  }

  // the request is a huge complex object that is sent to the server
  // console.log("request", request);
  console.log("url", request.url);
  console.log("method", request.method);
  console.log("headers", request.headers);

  console.log("");
  // this exits the event loop of the server and kills the server
  // process.exit();

  response.setHeader("Content-Type", "text/html");

  // this is the long way of writing html
  response.write("<html>");
  response.write("<head><title>My First Page</title></head>");
  response.write("<body><h1>Hello from my Node.js Server!</h1></body>");
  response.write("</html>");
  response.end(); // this is needed to send back to the client to know that it is done
});

server.listen(3000);
