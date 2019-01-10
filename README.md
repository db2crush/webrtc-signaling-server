## Introduction 
WebRTC-Signaling-Server

## Contributor
@name
SangGee Park (delbert)

@contact
delbertvibes@gmail.com

## Description
nodejs, es6, websocket, JSON

## Folder Structure
```bash
├── index.js
├── test
├── server
└── system
    ├── modules
    │   └── …
    ├── module.js (super module)
    ├── config.js (config module)
    └── system.js (top module)
```

## Git Branch
```bash
├── master
```

## Build and Run
1. Install all of denpendencies in the pacakage.json

```bash
 npm install
````

2. Simply enter the following command and the server opens with https://localhost:90 or http://localhost:90

```bash
development
npm run start

production
npm run build && npm run prod
```

## dist
```bash
├── server   (server    module)
├── system   (signaling module)
├── index.js (intro     file)
```

## Test

Simply enter the following command and checkout log

```bash
npm run server-test
npm run system-test
npm run signaling-test
npm run load-test
```


## Version
0.1
---
description: WebRTC Signaling Server
---





