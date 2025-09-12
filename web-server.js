const http = require('http');

// Create a simple HTTP server that returns "OK" for any request
const server = http.createServer((req, res) => {
  // Set CORS headers to allow requests from the renderer process
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Return "OK" for any request
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('OK');
});

// Start the server on port 9999, with fallback to other ports
const PORTS = [9999, 9998, 9997, 9996];
let currentPort = 0;

function tryStartServer() {
  if (currentPort >= PORTS.length) {
    console.error('Could not find an available port');
    if (process.send) {
      process.send({ type: 'server-error', error: 'No available ports' });
    }
    return;
  }

  const PORT = PORTS[currentPort];
  server.listen(PORT, 'localhost', () => {
    console.log(`Web server running on http://localhost:${PORT}`);
    
    // Send a message to the parent process that the server is ready
    if (process.send) {
      process.send({ type: 'server-ready', port: PORT });
    }
  });
}

// Handle port already in use
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORTS[currentPort]} is in use, trying next port...`);
    currentPort++;
    tryStartServer();
  } else {
    console.error('Server error:', err);
    if (process.send) {
      process.send({ type: 'server-error', error: err.message });
    }
  }
});

// Start the server
tryStartServer();

// Handle process termination
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});