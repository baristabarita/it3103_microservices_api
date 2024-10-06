const gateway = require('express-gateway');
const https = require('https');
const fs = require('fs');
const path = require('path');
const PORT = 3000;
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


const options = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH, 'utf8'),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH, 'utf8')
};

gateway()
  .load(path.join(__dirname, 'config'))
  .run(() => {
    https.createServer(options, gateway().app)
      .listen(PORT, () => {
        console.log(`API Gateway running on https://localhost:${PORT}`);
      });
  });
