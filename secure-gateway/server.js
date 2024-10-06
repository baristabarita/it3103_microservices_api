const path = require('path');
const https = require('https');
const fs = require('fs');
const gateway = require('express-gateway');

// Load environment variables
require('dotenv').config({
  path: path.resolve(__dirname, '../.env')
});

// Print environment variables for debugging
console.log('SSL_KEY_PATH:', process.env.SSL_KEY_PATH);
console.log('SSL_CERT_PATH:', process.env.SSL_CERT_PATH);

// Resolve and print the paths to ensure correctness
const keyPath = path.resolve(__dirname, process.env.SSL_KEY_PATH);
const certPath = path.resolve(__dirname, process.env.SSL_CERT_PATH);
console.log('Resolved Key Path:', keyPath);
console.log('Resolved Cert Path:', certPath);

// Check if environment variables are correctly set
if (!process.env.SSL_KEY_PATH || !process.env.SSL_CERT_PATH) {
  console.error('Missing SSL key or cert path in environment variables');
  process.exit(1);
}

// SSL certificate options
const options = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath)
};

(async () => {
  try {
    // Load and run express gateway config from config folder
    const gatewayInstance = await gateway().load(path.join(__dirname, 'config')).run();

    // Access express app instance from gateway
    const app = gatewayInstance[1]._events.request;

    // Validate that app is a function before starting the server
    if (typeof app !== 'function') {
      throw new TypeError('The "listener" argument must be of type function. Received ' + typeof app);
    }

    // Start HTTPS server on port 443
    https.createServer(options, app).listen(443, () => {
      console.log('Gateway now running on port 443');
    });
  } catch (error) {
    console.error('Error starting the server:', error);
  }
})();
