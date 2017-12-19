/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var messages = [];

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var endpoint = {
  '/classes/messages': 'messages'
};

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  
  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  
  switch (endpoint[request.url.split('?')[0]]) {
  case 'messages':
    handleMessages(request, response, headers);
    break;
  default:
    defaultHandler(response, headers, 404);
  }
};

handleMessages = (request, response, headers) => {
  switch (request.method) {
  case 'POST':
    postHandler(request, response, headers, 201);
    break;
  case 'GET':
    getHandler(request, response, headers, 200);
    break;
  case 'OPTIONS':
    defaultHandler(response, headers, 200);
    break;
  default:
    defaultHandler(response, headers, 405);
  }
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
defaultHandler = (response, headers, statusCode) => {
  response.writeHead(statusCode, headers);
  response.end();
};

getHandler = (request, response, headers, statusCode) => {
  // The outgoing status.
  var results;
  var options = request.url.split('?')[1];
  console.log('get request url:', request.url);
  if (options && options.split('=')[1] === '-createdAt') {
    results = JSON.stringify({'results': messages.slice().reverse()});
    // results = JSON.stringify({'results': messages});
  } else {
    results = JSON.stringify({'results': messages});
  }
  headers['Content-Type'] = 'application/json';
  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  response.end(results);
};

postHandler = (request, response, headers, statusCode) => {
  let body = [];
  request.on('error', (err) => {
    console.error(err);
  });
  request.on('data', (chunk) => {
    body.push(Buffer(chunk));
  });
  request.on('end', () => {
    body = Buffer.concat(body).toString();
    // at this point, `body` has the entire request body stored in it as a string
    messages.push(JSON.parse(body));
    
    // See the note below about CORS headers.
    var headers = defaultCorsHeaders;

    // Tell the client we are sending them plain text.
    //
    // You will need to change this if you are sending something
    // other than plain text, like JSON or HTML.
    headers['Content-Type'] = 'application/json';
    var results = JSON.stringify(messages);
    response.writeHead(statusCode, headers);
    response.end(results);
  });
};

exports.requestHandler = requestHandler;

