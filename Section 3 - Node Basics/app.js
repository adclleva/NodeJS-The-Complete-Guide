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

    /**
     * for the input, the name is the key, and the input is the value once submitted in this case
     */
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
    const body = [];

    // this listen for a data event whenever the data event will be fired whenever a new chunk is ready to be read
    request.on("data", (chunk) => {
      console.log("chunk", chunk); // we don't really work with chunks
      body.push(chunk);
    });

    return request.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      console.log("parseBody", parsedBody); // we can work with parsedBody

      const message = parsedBody.split("=")[1]; // this takes the "value" from the parsed body since the key is "message"

      // sometimes the code below this line may not execut since it is the "Sync" version and may need to wait for a bunch of requests
      // this is considered blocking
      // fs.writeFileSync("message.txt", message);

      // this is considered non-blocking, with the asyncronous nature of node.js
      fs.writeFile("message.txt", message, (error) => {
        // this response would only work once we are done working with the file and since it is within the callback function
        response.statusCode = 302;
        // Location is the default header by the browser
        response.setHeader("Location", "/");
        return response.end();
      });
    });
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
