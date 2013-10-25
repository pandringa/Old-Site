var util = require('util'),
    colors = require('colors'),
    http = require('http'),
    httpProxy = require('http-proxy');


var port = 3000;
//
// Http Proxy Server with Proxy Table
//
var server = httpProxy.createServer({
	hostnameOnly: true,
	router: {
	'peterandrin.ga': '127.0.0.1:3001',
	'www.peterandrin.ga': '127.0.0.1:3001',
	'96.241.49.209': '127.0.0.1:3001',
	'blog.peterandrin.ga': '127.0.0.1:3002',
	'localhost': '127.0.0.1:3001',
	'127.0.0.1': '127.0.0.1:3002'
	}
});


server.listen(port);



util.puts('http proxy server '.blue + 'started '.green.bold + 'on port '.blue + (port+' ').yellow + 'with proxy table'.magenta.underline);


require('./server/app.js');
require('./blog/index.js');