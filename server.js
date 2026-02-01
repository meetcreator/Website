const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.mjs': 'text/javascript',
    '.jsx': 'text/plain',
    '.map': 'application/json',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
    // Decode URL to handle spaces and special chars
    const requestUrl = decodeURI(req.url);
    // Strip query string for file lookup
    const pathname = requestUrl.split('?')[0];
    console.log(`${req.method} ${requestUrl}`);

    let filePath = '.' + pathname;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            // Handle Directory (EISDIR) - Serve Listing or Index
            if (error.code == 'EISDIR' || (error.code == 'ENOENT' && fs.existsSync(filePath) && fs.statSync(filePath).isDirectory())) {
                const indexPage = path.join(filePath, 'index.html');

                fs.readFile(indexPage, (err, indexContent) => {
                    if (err) {
                        // No index.html, generate directory listing
                        fs.readdir(filePath, (readDirErr, files) => {
                            if (readDirErr) {
                                res.writeHead(500);
                                res.end('Error reading directory: ' + readDirErr.code);
                                return;
                            }

                            // Simple Directory Listing HTML
                            res.writeHead(200, { 'Content-Type': 'text/html' });
                            let list = `<html><head><title>Directory: ${requestUrl}</title><style>body{font-family:monospace;padding:2rem;background:#0f172a;color:#fff}a{color:#22d3ee;display:block;margin:5px 0;text-decoration:none}a:hover{text-decoration:underline}</style></head><body><h1>Directory: ${requestUrl}</h1><hr>`;
                            if (requestUrl !== '/') list += `<a href="../">../</a>`;
                            files.forEach(file => {
                                list += `<a href="${path.join(requestUrl, file).replace(/\\/g, '/')}">${file}</a>`;
                            });
                            list += `</body></html>`;
                            res.end(list);
                        });
                    } else {
                        // index.html exists, serve it
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(indexContent, 'utf-8');
                    }
                });
                return;
            }

            // Handle File Not Found
            if (error.code == 'ENOENT') {
                res.writeHead(404);
                res.end('404 Not Found: ' + filePath);
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });

});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log('Press Ctrl+C to stop.');
});

server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use.`);
        console.error(`Please close any existing server windows and run launch.bat again.`);
        process.exit(1);
    }
});
