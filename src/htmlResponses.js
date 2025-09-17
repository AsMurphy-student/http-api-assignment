const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

// Response Function which sends back response
const respond = (request, response, code, content, type) => {
  response.writeHead(code, {
    'Content-Type': type,
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });
  response.write(content);
  response.end();
};

// Function which handles what response to send and in what format
const handleResponse = (request, response, code, message, id = undefined) => {
  if (request.acceptedTypes[0] === 'text/xml') {
    const responseXML = id
      ? `<response><message>${message}</message><id>${id}</id></response>`
      : `<response><message>${message}</message></response>`;

    return respond(request, response, code, responseXML, 'text/xml');
  }

  const responseJSON = id ? {
    message,
    id,
  } : {
    message,
  };

  return respond(request, response, code, JSON.stringify(responseJSON), 'application/json');
};

// List of request functions
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
  handleResponse(request, response, 200, 'This is a successful response');
};

const get400 = (request, response) => {
  if (request.query.valid === 'true') {
    return handleResponse(request, response, 200, 'valid query parameter of true received');
  }
  return handleResponse(request, response, 400, 'Missing valid query parameter set to true', 'badRequest');
};

const get401 = (request, response) => {
  if (request.query.loggedIn === 'yes') {
    return handleResponse(request, response, 200, 'loggedIn query parameter of yes received');
  }
  return handleResponse(request, response, 401, 'Missing loggedIn query parameter set to yes', 'unauthorized');
};

const get403 = (request, response) => {
  handleResponse(request, response, 403, 'You do not have access to this content.', 'forbidden');
};

const get500 = (request, response) => {
  handleResponse(request, response, 500, 'Internal Server Error. Something went wrong.', 'internalError');
};

const get501 = (request, response) => {
  handleResponse(request, response, 501, 'A get request for this page has not been implemented yet. Check again later for updated content.', 'notImplemented');
};

const get404 = (request, response) => {
  handleResponse(request, response, 404, 'The page you are looking for was not found.', 'notFound');
};

module.exports = {
  getIndex,
  getCss,
  get200,
  get400,
  get401,
  get403,
  get500,
  get501,
  get404,
};
