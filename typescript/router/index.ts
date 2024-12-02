import { createServer } from "node:http";

function listen() {
  const server = createServer((req, res) => {
    console.log(req.headers);

    res.writeHead(200);
    res.end("hello");
  });

  server.listen(30000);
}

listen();
