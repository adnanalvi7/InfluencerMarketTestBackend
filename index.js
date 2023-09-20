const express = require('express');
const axios = require('axios');
const http = require('http');
const https = require('https');

const app = express();
const port = 3802;

app.use((req, res, next) => {
  console.log('bbbbbbb')

  // Remove the X-Frame-Options header
  res.removeHeader('X-Frame-Options');
  next();
});

app.get('/', async (req, res) => {
  try {
    console.log('ccccccc')
    const targetUrl = 'https://app.stage.bsktpay.co/checkout';
    const response = await axios.get(targetUrl, {
      responseType: 'stream',
      httpAgent: new http.Agent({ keepAlive: true }),
      httpsAgent: new https.Agent({ keepAlive: true }),
    });

    // Forward headers from the target URL to the response
    Object.entries(response.headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    // Pipe the response content from the target URL to the client
    response.data.pipe(res);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).send('Error fetching content');
  }
});

app.listen(port, () => {
  console.log(`Proxy server listening at http://localhost:${port}`);
});
