const express = require('express');
const request = require('request');

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/api', (req, res) => {
  const apiUrl = req.query.url;

  if (!apiUrl) {
    return res.status(400).json({ type: 'error', message: 'Missing URL parameter' });
  }

  request
    .get(apiUrl)
    .on('error', (error) => {
      res.status(500).json({ type: 'error', message: error.message });
    })
    .pipe(res);
});

const PORT = process.env.PORT || 3802;
app.listen(PORT, () => console.log(`listening on ${PORT}`));