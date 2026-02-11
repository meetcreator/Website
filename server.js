const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const net = require('net');

/* --- CONFIGURATION --- */
const PROJECTS = {
    '/Archshield': {
        name: 'Archshield',
        // No frontend port - served statically via 8080
        backendPort: 8001,
        frontendPath: 'Archshield/frontend',
        backendPath: 'Archshield/backend',
        // Use venv python
        backendCommand: path.join(__dirname, 'Archshield/backend/venv/Scripts/python.exe'),
        backendArgs: ['-m', 'uvicorn', 'app.main:app', '--host', '0.0.0.0', '--port', '8001'],
        // No separate frontend server needed - static files are served by main server
        redirectUrl: '/Archshield/'
    },
    '/businessanalyticspro': {
        name: 'BusinessAnalyticsPro',
        // No frontend port - served statically via 8080
        backendPort: 8002,
        frontendPath: 'businessanalyticspro/Dashboard/frontend',
        backendPath: 'businessanalyticspro/Dashboard/backend',
        // Use venv python
        backendCommand: path.join(__dirname, 'businessanalyticspro/Dashboard/backend/venv/Scripts/python.exe'),
        backendArgs: ['-m', 'uvicorn', 'main:app', '--host', '0.0.0.0', '--port', '8002'],
        // No separate frontend server needed - static files are served by main server
        redirectUrl: '/businessanalyticspro/'
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

/* --- SERVER LOGIC --- */
const server = http.createServer((req, res) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);

    // 1. Handle Project Routes (Launchers)
    if (PROJECTS[req.url]) {
        launchProject(PROJECTS[req.url], res);
        return;
    }

    // 2. Resolve File Path
    let filePath;
    const url = req.url.split('?')[0]; // Ignore query strings

    if (url.startsWith('/Archshield')) {
        const subPath = url.substring('/Archshield'.length);
        const baseDir = path.join(__dirname, 'Archshield/frontend/out');
        filePath = path.join(baseDir, subPath === '' || subPath === '/' ? 'index.html' : subPath);

        // Handle Next.js clean URLs (e.g., /login -> /login.html or /login/index.html)
        if (!path.extname(filePath) && !fs.existsSync(filePath)) {
            if (fs.existsSync(filePath + '.html')) {
                filePath += '.html';
            } else if (fs.existsSync(path.join(filePath, 'index.html'))) {
                filePath = path.join(filePath, 'index.html');
            }
        }
    } else if (url.startsWith('/businessanalyticspro')) {
        const subPath = url.substring('/businessanalyticspro'.length);
        const baseDir = path.join(__dirname, 'businessanalyticspro/Dashboard/frontend/dist');
        filePath = path.join(baseDir, subPath === '' || subPath === '/' ? 'index.html' : subPath);
    } else {
        filePath = path.join(__dirname, url === '/' ? 'index.html' : url);
    }

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

        // Start Backend (Silent if already claimed)
        const backend = spawn(config.backendCommand, config.backendArgs, {
            cwd: path.join(__dirname, config.backendPath),
            shell: true
        });
        backend.stdout.on('data', (d) => process.stdout.write(`[BE]: ${d}`));
        backend.stderr.on('data', (d) => process.stderr.write(`[BE-ERR]: ${d}`));

        runningProcesses[config.name] = { backend };

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
                body { background: #050a14; color: white; margin: 0; display: flex; align-items: center; justify-content: center; height: 100vh; overflow: hidden; }
                .loader { width: 50px; height: 50px; border: 3px solid rgba(255,255,255,0.1); border-radius: 50%; border-top-color: #3b82f6; animation: spin 0.8s ease-in-out infinite; }
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
