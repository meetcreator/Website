const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const net = require('net');

/* --- CONFIGURATION --- */
const PROJECTS = {
    '/archshield': {
        name: 'Archshield',
        backendPort: 8001,
        frontendPath: 'archshield-app/frontend',
        backendPath: 'archshield-app/backend',
        backendCommand: path.join(__dirname, 'archshield-app/backend/venv/Scripts/python.exe'),
        backendArgs: ['-m', 'uvicorn', 'app.main:app', '--host', '0.0.0.0', '--port', '8001'],
        redirectUrl: '/archshield/'
    },
    '/business': {
        name: 'Business',
        backendPort: 8002,
        frontendPath: 'business',
        backendPath: 'business/backend',
        backendCommand: 'npm',
        backendArgs: ['run', 'start:prod'],
        redirectUrl: '/business/'
    },
    '/olympiad': {
        name: 'Olympiad',
        frontendPort: 3000,
        frontendPath: 'olympiad',
        frontendCommand: 'npm',
        frontendArgs: ['run', 'dev'],
        redirectUrl: 'http://localhost:3000/olympiad'
    },
    '/procurement': {
        name: 'procurement',
        backendPort: 8000,
        backendPath: '../procurement_ai/backend',
        backendCommand: 'python',
        backendArgs: ['-m', 'uvicorn', 'app.main:app', '--host', '127.0.0.1', '--port', '8000'],
        redirectUrl: '/procurement/'
    }
};

const PORT = 8080;
const runningProcesses = {};

/* --- HELPER: CHECK PORT --- */
function checkPort(port, callback) {
    const socket = new net.Socket();
    socket.setTimeout(200);
    socket.on('connect', () => {
        socket.destroy();
        callback(true);
    });
    socket.on('timeout', () => {
        socket.destroy();
        callback(false);
    });
    socket.on('error', (err) => {
        socket.destroy();
        callback(false);
    });
    socket.connect(port, '127.0.0.1');
}

/* --- HELPER: NEXT.JS STATIC PATHS RESOLVER --- */
function resolveNextStaticPath(filePath) {
    if (filePath.includes('__next') && !fs.existsSync(filePath)) {
        const parts = filePath.split('__next');
        const prefix = parts[0];
        let suffix = parts.slice(1).join('__next');
        
        if (suffix.startsWith('.')) {
            suffix = '/' + suffix.substring(1);
            if (suffix.endsWith('.__PAGE__.txt')) {
                const base = suffix.substring(0, suffix.length - 13);
                suffix = base.replace(/\./g, '/') + '.__PAGE__.txt';
            } else if (suffix.endsWith('.txt')) {
                const base = suffix.substring(0, suffix.length - 4);
                suffix = base.replace(/\./g, '/') + '.txt';
            }
            const candidate = prefix + '__next' + suffix;
            if (fs.existsSync(candidate)) {
                return candidate;
            }
        }
    }
    return filePath;
}

/* --- SERVER LOGIC --- */
const server = http.createServer((req, res) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);

    const lowerUrl = req.url.split('?')[0].toLowerCase();

    // 1. Redirection & Rewrites matching Vercel configurations
    if (lowerUrl === '/operations' || lowerUrl.startsWith('/operations/')) {
        const subPath = lowerUrl === '/operations' ? '' : req.url.substring(11);
        res.writeHead(301, { 'Location': '/procurement/operations' + subPath });
        res.end();
        return;
    }
    if (lowerUrl === '/procurement_ai' || lowerUrl.startsWith('/procurement_ai/')) {
        const subPath = lowerUrl === '/procurement_ai' ? '' : req.url.substring(15);
        res.writeHead(301, { 'Location': '/procurement' + subPath });
        res.end();
        return;
    }

    // Trailing slash redirects for static demo directories
    if (lowerUrl === '/ca-webcodex' || lowerUrl === '/ca-website' || lowerUrl === '/import-export') {
        res.writeHead(301, { 'Location': req.url + '/' });
        res.end();
        return;
    }

    // 2. Handle Project Routes (Launchers)
    if (PROJECTS[lowerUrl]) {
        launchProject(PROJECTS[lowerUrl], res);
        return;
    }

    // 3. Resolve File Path
    let filePath;
    const url = req.url.split('?')[0]; // Ignore query strings

    if (lowerUrl.startsWith('/archshield')) {
        const subPath = url.substring(11); // '/archshield'.length
        const baseDir = path.join(__dirname, 'archshield-app/frontend/out');
        filePath = path.join(baseDir, subPath === '' || subPath === '/' ? 'index.html' : subPath);

        // Handle Next.js clean URLs
        if (!path.extname(filePath)) {
            let isDir = false;
            try { isDir = fs.statSync(filePath).isDirectory(); } catch (e) { }

            if (!fs.existsSync(filePath) || isDir) {
                if (fs.existsSync(filePath + '.html')) {
                    filePath += '.html';
                } else if (fs.existsSync(path.join(filePath, 'index.html'))) {
                    filePath = path.join(filePath, 'index.html');
                }
            }
        }
    } else if (lowerUrl.startsWith('/business')) {
        const subPath = url.substring(9); // '/business'.length
        const baseDir = path.join(__dirname, 'business/out');
        filePath = path.join(baseDir, subPath === '' || subPath === '/' ? 'index.html' : subPath);

        // Handle Next.js clean URLs
        if (!path.extname(filePath)) {
            let isDir = false;
            try { isDir = fs.statSync(filePath).isDirectory(); } catch (e) { }

            if (!fs.existsSync(filePath) || isDir) {
                if (fs.existsSync(filePath + '.html')) {
                    filePath += '.html';
                } else if (fs.existsSync(path.join(filePath, 'index.html'))) {
                    filePath = path.join(filePath, 'index.html');
                }
            }
        }
    } else if (lowerUrl.startsWith('/olympiad')) {
        const subPath = url.substring(9); // '/olympiad'.length
        const baseDir = path.join(__dirname, 'olympiad/out');
        filePath = path.join(baseDir, subPath === '' || subPath === '/' ? 'index.html' : subPath);

        // Handle Next.js clean URLs
        if (!path.extname(filePath)) {
            let isDir = false;
            try { isDir = fs.statSync(filePath).isDirectory(); } catch (e) { }

            if (!fs.existsSync(filePath) || isDir) {
                if (fs.existsSync(filePath + '.html')) {
                    filePath += '.html';
                } else if (fs.existsSync(path.join(filePath, 'index.html'))) {
                    filePath = path.join(filePath, 'index.html');
                }
            }
        }
    } else if (lowerUrl === '/procurement' || lowerUrl.startsWith('/procurement/')) {
        let subPath = lowerUrl === '/procurement' ? 'index.html' : url.substring(13); // '/procurement/'.length
        if (subPath === '' || subPath === '/') subPath = 'index.html';
        filePath = path.join(__dirname, 'procurement', subPath);

        // Handle clean URLs
        if (!path.extname(filePath)) {
            let isDir = false;
            try { isDir = fs.statSync(filePath).isDirectory(); } catch (e) { }

            if (!fs.existsSync(filePath) || isDir) {
                if (fs.existsSync(filePath + '.html')) {
                    filePath += '.html';
                } else if (fs.existsSync(path.join(filePath, 'index.html'))) {
                    filePath = path.join(filePath, 'index.html');
                }
            }
        }
    } else if (lowerUrl === '/ca-webcodex' || lowerUrl.startsWith('/ca-webcodex/')) {
        const subPath = url.substring(13) || 'index.html'; // '/ca-webcodex/'.length = 13
        filePath = path.join(__dirname, 'demo-websites/ca-webcodex', subPath === '/' ? 'index.html' : subPath);
    } else if (lowerUrl === '/ca-website' || lowerUrl.startsWith('/ca-website/')) {
        const subPath = url.substring(12) || 'index.html'; // '/ca-website/'.length = 12
        filePath = path.join(__dirname, 'demo-websites/ca-website', subPath === '/' ? 'index.html' : subPath);
    } else if (lowerUrl === '/import-export' || lowerUrl.startsWith('/import-export/')) {
        const subPath = url.substring(15) || 'index.html'; // '/import-export/'.length = 15
        filePath = path.join(__dirname, 'demo-websites/import-export', subPath === '/' ? 'index.html' : subPath);
    } else if (
        lowerUrl.startsWith('/dashboard') || 
        lowerUrl === '/login' || lowerUrl.startsWith('/login/') || 
        lowerUrl === '/signup' || lowerUrl.startsWith('/signup/') || 
        lowerUrl.startsWith('/_not-found') || 
        lowerUrl === '/favicon.ico' || 
        (lowerUrl.startsWith('/_next/') && !req.headers.referer?.includes('/business') && !req.headers.referer?.includes('/olympiad'))
    ) {
        const baseDir = path.join(__dirname, 'archshield-app/frontend/out');
        filePath = path.join(baseDir, url);

        // Handle Next.js clean URLs
        if (!path.extname(filePath)) {
            let isDir = false;
            try { isDir = fs.statSync(filePath).isDirectory(); } catch (e) { }

            if (!fs.existsSync(filePath) || isDir) {
                if (fs.existsSync(filePath + '.html')) {
                    filePath += '.html';
                } else if (fs.existsSync(path.join(filePath, 'index.html'))) {
                    filePath = path.join(filePath, 'index.html');
                }
            }
        }
    } else {
        const referer = req.headers.referer || '';
        if (referer.includes('/archshield') && !lowerUrl.startsWith('/archshield')) {
            filePath = path.join(__dirname, 'archshield-app/frontend/out', url);
        } else if (referer.includes('/business') && !lowerUrl.startsWith('/business')) {
            filePath = path.join(__dirname, 'business/out', url);
        } else if (referer.includes('/olympiad') && !lowerUrl.startsWith('/olympiad')) {
            filePath = path.join(__dirname, 'olympiad/out', url);
        } else if (referer.includes('/procurement') && !lowerUrl.startsWith('/procurement')) {
            filePath = path.join(__dirname, 'procurement', url);
        } else if (referer.includes('/ca-webcodex') && !lowerUrl.startsWith('/ca-webcodex')) {
            filePath = path.join(__dirname, 'demo-websites/ca-webcodex', url);
        } else if (referer.includes('/ca-website') && !lowerUrl.startsWith('/ca-website')) {
            filePath = path.join(__dirname, 'demo-websites/ca-website', url);
        } else if (referer.includes('/import-export') && !lowerUrl.startsWith('/import-export')) {
            filePath = path.join(__dirname, 'demo-websites/import-export', url);
        } else {
            filePath = path.join(__dirname, url === '/' ? 'index.html' : url);
        }
        
        // Handle clean URLs for general root pages (e.g. /portfolio -> /portfolio.html)
        if (!path.extname(filePath)) {
            if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
                filePath += '.html';
            }
        }
    }

    filePath = resolveNextStaticPath(filePath);

    const extname = path.extname(filePath);
    let contentType = 'text/html';

    switch (extname) {
        case '.js': contentType = 'text/javascript'; break;
        case '.css': contentType = 'text/css'; break;
        case '.json': contentType = 'application/json'; break;
        case '.png': contentType = 'image/png'; break;
        case '.jpg': contentType = 'image/jpg'; break;
        case '.svg': contentType = 'image/svg+xml'; break;
        case '.woff2': contentType = 'font/woff2'; break;
        case '.ico': contentType = 'image/x-icon'; break;
        case '.txt': contentType = 'text/plain'; break;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            console.log(`[STATIC-FAIL] ${req.url} -> ${filePath} (${error.code})`);
            if (error.code == 'ENOENT') {
                res.writeHead(404);
                res.end('404 Not Found');
            } else {
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

/* --- LAUNCHER FUNCTION --- */
function launchProject(config, res) {
    // 1. Check if already running
    if (runningProcesses[config.name]) {
        console.log(`[INFO] ${config.name} tracked as running.`);
    } else {
        console.log(`[LAUNCH] Starting ${config.name}...`);

        runningProcesses[config.name] = {};

        // Start Backend (Only if configured)
        if (config.backendCommand) {
            const backend = spawn(config.backendCommand, config.backendArgs, {
                cwd: path.join(__dirname, config.backendPath),
                shell: true
            });
            backend.stdout.on('data', (d) => process.stdout.write(`[BE]: ${d}`));
            backend.stderr.on('data', (d) => process.stderr.write(`[BE-ERR]: ${d}`));
            runningProcesses[config.name].backend = backend;
        }

        // Start Frontend (Only if configured)
        if (config.frontendCommand) {
            const frontend = spawn(config.frontendCommand, config.frontendArgs, {
                cwd: path.join(__dirname, config.frontendPath),
                shell: true
            });
            frontend.stdout.on('data', (d) => process.stdout.write(`[FE]: ${d}`));
            frontend.stderr.on('data', (d) => process.stderr.write(`[FE-ERR]: ${d}`));
            frontend.on('error', (err) => console.error(`[FE-FAIL] ${err}`));

            runningProcesses[config.name].frontend = frontend;
        }
    }

    // 2. Check Port Availability
    // SPECIAL CASE: If it's a static site (redirectUrl exists and no frontendPort/frontendCommand needed), redirect immediately.
    // The details page (frontend) is ready instantly because it is served by the main server.
    // We let the backend start in background.
    if (config.redirectUrl && !config.frontendPort) {
        console.log(`[REDIRECT] ${config.name} is static content. Redirecting immediately.`);
        res.writeHead(302, { 'Location': config.redirectUrl });
        res.end();
        return;
    }

    // Default: Check if the target port (frontend or backend) is ready before redirecting
    const targetPort = config.frontendPort || config.backendPort;
    const finalUrl = config.redirectUrl || `/${config.name.toLowerCase()}`;

    checkPort(targetPort, (isOpen) => {
        if (isOpen) {
            console.log(`[REDIRECT] ${config.name} is ready. Redirecting.`);
            res.writeHead(302, { 'Location': finalUrl });
            res.end();
        } else {
            console.log(`[WAIT] ${config.name} (Port ${targetPort}) not ready.`);
            servePollingPage(res, config, targetPort, finalUrl);
        }
    });
}

function servePollingPage(res, config, checkPortNum, targetUrl) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Opening ${config.name}...</title>
            <style>
                body { background: #ffffff; color: black; margin: 0; display: flex; align-items: center; justify-content: center; height: 100vh; overflow: hidden; }
                .loader { width: 50px; height: 50px; border: 3px solid rgba(0,0,0,0.1); border-top-color: #000000; animation: spin 0.8s ease-in-out infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
            </style>
            <script>
                // We poll the SERVER endpoint again, effectively refreshing until redirected
                // Because we can't CORS check an external backend port easily from client JS
                // We just reload this page after a delay. The server logic above repeats checkPort.

                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            </script>
        </head>
        <body>
            <div class="loader"></div>
        </body>
        </html>
    `);
}

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
