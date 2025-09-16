const http = require('http');
const htmlHandler = require('./htmlResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (request, response) => {
  switch (request.url) {
    case '/':
      htmlHandler.getIndex(request, response);
      break;
    case '/style.css':
      htmlHandler.getCss(request, response);
      break;
    default:
      console.log('implement default case');
      break;
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on port 127.0.0.${port}`);
});
