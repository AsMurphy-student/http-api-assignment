const http = require('http');
const htmlHandler = require('./htmlResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getCss,
  '/success': htmlHandler.get200,
  '/forbidden': htmlHandler.get403,
  '/internal': htmlHandler.get500,
  '/notImplemented': htmlHandler.get501,
  index: htmlHandler.get404,
};

const onRequest = (request, response) => {
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

  request.acceptedTypes = request.headers.accept.split(',');

  urlStruct[parsedUrl.pathname]
    ? urlStruct[parsedUrl.pathname](request, response)
    : urlStruct.index(request, response);
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on port 127.0.0.${port}`);
});
