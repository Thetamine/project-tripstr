const express = require('express');

server = express();

server.get('/', function(req, res){

});

console.log('server is listening on port 3000: ');
server.listen(3000);