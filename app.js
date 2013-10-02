var forever = require('forever-monitor');
var color = require("string-color");
var expressPort = 3000;

var childOptions = {
        'silent': false,
        'max' : 5,
        'options' : [expressPort],
        'killTree': true,
        'watch': false
    }

var child = new(forever.Monitor)('./server/app.js', childOptions);

child.on('exit', function() {
	console.log("Exited Node after" + childOptions.max + "restart attempts".color("red"));
})

child.on('start', function() {
  console.log('Foever process running server/app.js'.color("green"));
})


// not sure if we need this
child.start();
//forever.startServer(child);