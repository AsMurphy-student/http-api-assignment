const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

const respond = (request, response, code, content, type) => {
  response.writeHead(code, {
    'Content-Type': type,
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });
  response.write(content);
  response.end();
};

const handleResponse = (request, response, code) => {
  // if (request.acceptedTypes[0] === 'text/xml') {
    let responseXML = '<response><message>';
    switch (code) {
      case 200:
        responseXML+='This is a successful response</message>'
        break;
      case 403:
        responseXML+='You do not have access to this content.</message><id>forbidden</id>'
        break;
      case 500:
        responseXML+='Internal Server Error. Something went wrong.</message><id>internalError</id>'
        break;
      case 501:
        responseXML+='A get request for this page has not been implemented yet. Check again later for updated content.</message><id>notImplemented</id>'
        break;
      default:
        responseXML+='The page you are looking for was not found.</message><id>notFound</id>'
        break;
    }
    responseXML+='</response>'

    return respond(request, response, code, responseXML, request.acceptedTypes[0] === 'text/xml');
  // }

  
};

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getCss = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

const get200 = (request, response) => {
  handleResponse(request, response, 200);
};

const get403 = (request, response) => {
  handleResponse(request, response, 403);
};

const get500 = (request, response) => {
  handleResponse(request, response, 500);
};

const get501 = (request, response) => {
  handleResponse(request, response, 501);
};

const get404 = (request, response) => {
  handleResponse(request, response, 404);
};

module.exports = {
  getIndex,
  getCss,
  get200,
  get403,
  get500,
  get501,
  get404,
};
