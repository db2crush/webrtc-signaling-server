/**
 * delbertvibes - WebRTC Signaling Server
 * Client Module - Observer 
 */
import {
    Logger
} from '../Logger'
import {
    sendMessage
} from './Provider'

export class Client extends Logger {
    /**
     * 
     * @param {websocket} ws 
     * @param {string} sId 
     * @param {object} clientList 
     */
    constructor(ws, sId, clientList) {
        super('Client')

        this.state = 1
        this.sId = sId
        this.ws = null

        if (ws && ws.constructor.name == 'WebSocket') {
            ws.sId = this.sId
            this.ws = ws
            this.ws.isAlive = true

            this.notify({
                cmd: 'sId',
                sId: this.sId
            })
            this.ws.heartbeat = setInterval(_ => {
                this.sendPing()
            }, 3000)
        }

        if (clientList && clientList.constructor.name == 'ClientList') {
            clientList.addClient(this)
        }
    }

    notify(message, callback) {
        sendMessage(this.ws, message)
            .then(_ => {
                return callback instanceof Function && callback()
            })
            .catch(code => {
                super.error('can not send message to ' + this.ws.sId, code)
                return callback instanceof Function && callback(code)
            })
    }

    set(state) {
        if (this.state != state) {
            this.state = state
        }
    }

    kill() {
        if (this.ws && this.ws.constructor.name == 'WebSocket') {
            this.ws.terminate()
        }
    }

    async sendPing() {
        try {
            if (this.ws.isAlive === false) {
                this.kill()
                return clearInterval(this.ws.heartbeat)
            } else {
                this.ws.isAlive = false
            }

            await this.ws.ping(_ => {})
        } catch (e) {
            super.error('can not send ping.')
        }
    }
}