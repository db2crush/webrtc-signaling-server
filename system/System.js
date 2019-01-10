/**
 * delbertvibes - WebRTC Signaling Server
 * Server Main Module
 */

import {
    Logger
} from './Logger'
import {
    Processor
} from './modules/Processor'
import * as Receiver from './Receiver'
export class System extends Logger {
    constructor(wss) {
        super('System')
        this.wss = wss
    }

    start() {
        if (this.wss.constructor.name == 'WebSocketServer') {
            console.log('\x1b[34m%s\x1b[0m', 'signaling system running...')

            this.processor = new Processor()
            this.listen()

            return Promise.resolve(this)
        } else {
            return Promise.reject('needs websocket server as parameter')
        }
    }

    listen() {
        this.wss.on('connection', (ws) => {
            super.log('client connected.')

            ws.on('error', e => {
                super.error('client connection error. ' + e)
                Receiver.connectionErrorReceiver.call(this, ws, e)
            })

            ws.on('close', code => {
                super.log('client disconnected. code: ' + code)
                Receiver.connectionClosedReceiver.call(this, ws, code)
            })

            ws.on('pong', _ => {
                ws.isAlive = true
            })

            ws.on('message', msg => Receiver.messageReceiver.call(this, ws, msg))
        })
    }
}