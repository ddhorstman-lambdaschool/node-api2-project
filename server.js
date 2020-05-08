const express = require('express');
const postsRouter = require('./posts/postsRouter.js');
const server = express();

server.use(express.json());
server.use("/api/posts", postsRouter);

server.get("/", (req, res) => {
    res.status(200).send(`
    <html>
        <head><title>Node Project 2 Router</title></head>
        <body>
            <h1>Node Project 2 Router</h1>
            <p>See the
                <a href = "https://github.com/ddhorstman-lambdaschool/node-api2-project">Readme</a>
            for documentation on its usage.</p>
        </body>
    </html>`);
});

module.exports = server;