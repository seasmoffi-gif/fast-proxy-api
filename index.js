const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.raw({ type: '*/*' }));

const cache = {};
const CACHE_TIME = 10 * 60 * 1000; // 10 dakika

app.all('/proxy', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send('Missing url parameter');

    const cached = cache[targetUrl];
    if (cached && (Date.now() - cached.timestamp < CACHE_TIME)) {
        res.set(cached.headers);
        return res.send(cached.body);
    }

    try {
        const options = {
            method: req.method,
            headers: { ...req.headers },
            body: ['GET', 'HEAD'].includes(req.method) ? undefined : req.body
        };

        const response = await fetch(targetUrl, options);
        const buffer = await response.buffer();

        cache[targetUrl] = {
            body: buffer,
            headers: Object.fromEntries(response.headers.entries()),
            timestamp: Date.now()
        };

        res.set(Object.fromEntries(response.headers.entries()));
        res.status(response.status).send(buffer);

    } catch (err) {
        console.error(err);
        res.status(500).send('Proxy error');
    }
});

// Port 3009
app.listen(3009, () => console.log('Proxy server running on http://localhost:3009'));