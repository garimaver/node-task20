const http = require('http');
const fs = require('fs').promises; // Importing the 'fs' module with promises for file system operations.
const path = require('path');

const PORT = 3000;
const PUBLIC_DIR = path.join(__dirname, 'public'); // Setting the path to the public directory using 'path.join' to ensure platform independence.

const server = http.createServer(async (req, res) => {
    let filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'home.html' : `${req.url}.html`); // Constructing the file path based on the requested URL.
    let statusCode = 200; // Setting the default status code to 200 (OK).
    let contentType = 'text/html'; // Setting the default content type to HTML.

    try {
        const fileContent = await fs.readFile(filePath, 'utf8'); // Reading the content of the requested file asynchronously.
        res.writeHead(statusCode, {'Content-Type': contentType}); // Writing the response headers.
        res.end(fileContent); // Sending the file content as the response body.
    } catch (error) {
        if (error.code === 'ENOENT') { // Handling the case where the requested file is not found (404 error).
            filePath = path.join(PUBLIC_DIR, '404.html'); // Setting the file path to the 404.html page.
            statusCode = 404; // Setting the status code to 404 (Not Found).
            const fileContent = await fs.readFile(filePath, 'utf8'); // Reading the content of the 404.html file.
            res.writeHead(statusCode, {'Content-Type': contentType}); // Writing the response headers.
            res.end(fileContent); // Sending the file content as the response body.
        } else { // Handling other errors (500 Internal Server Error).
            console.error(error); // Logging the error to the console.
            res.writeHead(500, {'Content-Type': 'text/plain'}); // Setting the status code and content type for the error response.
            res.end('500 Internal Server Error'); // Sending the error message as the response body.
        }
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`); // Logging a message when the server starts listening on the specified port.
});
