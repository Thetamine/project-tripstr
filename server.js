const express = require('express');
server = express();

server.use(express.static(__dirname + 'index.html'));

console.log('server is listening on port 3000: ');
server.listen(8080);