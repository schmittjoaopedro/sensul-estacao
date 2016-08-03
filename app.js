/**
* Do the right imports
*/
var http = require('http'),
    httpProxy = require('http-proxy'),
    express = require('express');

/**
* Server of node-red.
* Create the proxy able to redirect HTTP and WebSocket requests.
* Create an express server to return the static files with the right content type.
*/
var proxyApp = httpProxy.createProxyServer({ ws: true }),
	host = 'http://localhost:1880',
	app = express();

app.use(express.static('public'));

proxyApp.on('proxyReq', function(proxyReq, req, res, options) {
  proxyReq.setHeader('X-Special-Proxy-Header', 'foobar');
});


var server = http.createServer(app);

/**
* When the HTTP upgrade is received (WebSocket packet) this packets is redirected to node-red
*/
server.on('upgrade', function (req, socket, head) {
	proxyApp.ws(req, socket, head, {
			target: host
		}, receiveError);
});

/**
* For all calls for /resource the proxy will redirect to node-red
*/
app.use(function(req, res, next) {
	console.info(req.url);
	if(req.url.startsWith('/resources')) {
		proxyApp.web(req, res, {
			target: host
		}, receiveError);
	} else {
		next();
	}
});

function receiveError(err) {
	console.info(err);
}

//Start the server
server.listen(80);
