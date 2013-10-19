var util = require('util'),
    colors = require('colors'),
    http = require('http'),
    httpProxy = require('http-proxy');


var port = 3000;
//
// Http Proxy Server with Proxy Table
//
httpProxy.createServer({
	hostnameOnly: true,
	router: {
	'peterandrin.ga': 'localhost:3001',
	"96.241.49.209": 'localhost:3001',
	//'blog.peterandrin.ga': 'localhost:3002'
	}
}).listen(port);



util.puts('http proxy server '.blue + 'started '.green.bold + 'on port '.blue + (port+' ').yellow + 'with proxy table'.magenta.underline);


//require('./blog/index.js');
require('./server/app.js');