const http = require('http');
const htmlHandler = require('./htmlResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// URL Struct because it is a lot easier
const urlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getCss,
  '/success': htmlHandler.get200,
  '/badRequest': htmlHandler.get400,
  '/unauthorized': htmlHandler.get401,
  '/forbidden': htmlHandler.get403,
  '/internal': htmlHandler.get500,
  '/notImplemented': htmlHandler.get501,
  index: htmlHandler.get404,
};

// On request function when server receives a request
const onRequest = (request, response) => {
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

  request.query = Object.fromEntries(parsedUrl.searchParams);

  request.acceptedTypes = request.headers.accept.split(',');

  return urlStruct[parsedUrl.pathname]
    ? urlStruct[parsedUrl.pathname](request, response)
    : urlStruct.index(request, response);
};

http.createServer(onRequest).listen(port);

