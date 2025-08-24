const express = require('express');
const fetch = require('node-fetch'); // v3 kullanıyorsan import ile kullan
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.raw({ type: '*/*' })); // Her türlü bodyyi yakalamak için

// Basit cache objesi
const cache = {};
const CACHE_TIME = 10 * 60 * 1000; // 10 dakika

app.all('/proxy', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send('Missing url parameter');

    // Cache kontrolü
    const cached = cache[targetUrl];
    if (cached && (Date.now() - cached.timestamp < CACHE_TIME)) {
        console.log('Cache hit:', targetUrl);
        res.set(cached.headers);
        return res.send(cached.body);
    }

    try {
        const options = {
            method: req.method,
            headers: { ...req.headers },
            body: ['GET', 'HEAD'].includes(req.method) ? undefined : req.body
        };

        // Fetch ile hedef URL'ye istek at
        const response = await fetch(targetUrl, options);
        const buffer = await response.buffer();

        // Cache kaydet
        cache[targetUrl] = {
            body: buffer,
            headers: Object.fromEntries(response.headers.entries()),
            timestamp: Date.now()
        };

        // Headerleri ve cevabı gönder
        res.set(Object.fromEntries(response.headers.entries()));
        res.status(response.status).send(buffer);

    } catch (err) {
        console.error(err);
        res.status(500).send('Proxy error');
    }
});

app.listen(3009, () => {
    console.log('Proxy server running on http://localhost:3000');
});
