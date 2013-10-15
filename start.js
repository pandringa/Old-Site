var http = require('http'),
    httpProxy = require('http-proxy');

//
// Create a proxy server with custom application logic
//
httpProxy.createServer({

  router: {
    'localhost': '127.0.0.1:5000',
    'localhost:8080': '127.0.0.1:4000'
  }
}).listen(3000);

require('./blog/index.js');
require('./server/app.js');