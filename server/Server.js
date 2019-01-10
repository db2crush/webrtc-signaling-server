import https from 'https'
import http from 'http'
import debug from 'debug'
import fs from 'fs'
import path from 'path'
import { Server as WebSocketServer } from 'ws'
import cluster from 'cluster'
import os from 'os'

export default class Server {
    /**
     * @param {protocol} protocol 
     * @param {int} port 
     * @param {boolean} clustering
     */
    constructor(protocol, port, clustering) {
        this.protocol = process.env.protocol = (protocol || 'http')
        this.port = process.env.port = (port || 90)
        this.clustering = process.env.cluster = (clustering || false)
        this.server = null
        this.wss = null
        this.debug = debug('delbertvibes-webrtc-signaling-server:server')
        this.workers = (process.env.WORKERS || os.cpus().length)
    }

    start () {
        if (this.clustering) {
            this.createClusterServer()
        } else {
            this.createServer()
        }
        return Promise.resolve(this)
    }

    createClusterServer () {
        if (cluster.isMaster) {
            console.log('start cluster with %s workers', this.workers)

            for (var i=0; i<this.workers; ++i) {
                let worker = cluster.fork().process
                console.log('worker %s started.', worker.pid)
            }

            cluster.on('exit', (worker) => {
                console.error('\x1b[31m%s\x1b[0m', 'worker ' + worker.process.pid + ' died. restart...')
                cluster.fork()
            })
        } else {
            this.createServer()
        }
    }

    createServer () {
        if (this.protocol == 'https') {
            const options = {
                key: fs.readFileSync(path.join(__dirname, '../ssl/server.key')),
                cert: fs.readFileSync(path.join(__dirname, '../ssl/server.crt'))
            }
            this.server = https.createServer(options, (req, res) => {
                res.writeHead(200, {'Content-Type': 'text/plain'})
                res.end('...\n')
            })
        } else {
            this.server = http.createServer((req, res) => {
                res.writeHead(200, {'Content-Type': 'text/plain'})
                res.end('...\n')
            })
        }

        this.server.on('error', this.onError)
        this.server.on('close', this.onClose)
        this.server.on('listening', this.onListening)

        process.on('uncaughtException', this.onException)

        this.wss = new WebSocketServer({
            server: this.server
        })

        this.server.listen(this.port)
    }

    onListening () {
        console.log('\x1b[34m%s\x1b[0m', 'signaling server started at ' + process.env.protocol + '://' + getServerIp() + ':' + process.env.port)
    }

    onClose (err) {
        console.error('\x1b[31m%s\x1b[0m', 'server closed. ' + err)
    }

    onError (err) {
        if (err.syscall !== 'listen') {
            throw err
        }

        let bind = typeof this.port === 'string' ? 'Pipe ' + this.port : 'Port ' + this.port

        switch (err.code) {
            case 'EACCES':
                console.error('\x1b[31m%s\x1b[0m', bind + ' requires elevated privileges.')
                process.exit(1)
                break
            case 'EADDRINUSE':
                console.error('\x1b[31m%s\x1b[0m', bind + ' is already in use')
                process.exit(1)
                break
            default:
                throw err
        }
    }

    onException (err) {
        console.error('\x1b[31m%s\x1b[0m', (new Date).toUTCString() + ' uncaughtException:' + err.message)
        console.error(err.stack)
        process.exit(1)
    }
}

function getServerIp() {
    var ifaces = os.networkInterfaces();
    var result = '';
    for (var dev in ifaces) {
        var alias = 0;
        ifaces[dev].forEach(function(details) {
            if (details.family == 'IPv4' && details.internal === false) {
                result = details.address;
                ++alias;
            }
        });
    }
  
    return result;
}