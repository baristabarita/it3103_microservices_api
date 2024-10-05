const path = require('path');
const https = require('https');
const fs = require('fs');
const gateway = require('express-gateway');
require('dotenv').config();

const options = {
  key: fs.readFileSync(path.resolve(__dirname, process.env.SSL_KEY_PATH)),
  cert: fs.readFileSync(path.resolve(__dirname, process.env.SSL_CERT_PATH))
};

// console.log('SSL Options:', options);

(async () => {
  try {
    // console.log('Loading gateway configuration...');
    const gatewayInstance = await gateway().load(path.join(__dirname, 'config')).run();

    const app = gatewayInstance[1]._events.request;

    // console.log('Type of app:', typeof app);
    // console.log('Value of app:', app);

    if (typeof app !== 'function') {
      throw new TypeError('The "listener" argument must be of type function. Received ' + typeof app);
    }

    https.createServer(options, app).listen(443, () => {
      console.log('Gateway now running on port 443');
    });
  } catch (error) {
    console.error('Error starting the server:', error);
  }
})();