/**
 * delbertvibes - WebRTC Signaling Server
 * Client list Module - Observer Subject (Observable)
 */
import { Logger } from '../Logger'

export class ClientList extends Logger {
    constructor () {
        super('ClientList')
        
        this.clients = new Map()
    }

    addClient (client) {        
        if (client.sId) {
            if (!this.isClient(client.sId)) {
                super.log(client.sId + ' added to client list.')
                this.clients.set(client.sId, client)
                this.broadCast()
            } else {
                super.error(client.sId + ' already existed on client list.')
            }
        } else {
            super.error('client does not have sId.')
        }
    }

    removeClient (clientId) {  
        super.log(clientId + ' removed from client list.')      
        this.clients.delete(clientId)
        this.broadCast()
    }

    isClient (clientId) {
        return this.clients.has(clientId)
    }

    getClient (clientId) {
        if (this.isClient(clientId)) {
            return this.clients.get(clientId)
        } else {
            return null
        }
    }

    getSize () {
        return this.clients.size
    }

    broadCast () {
        let list = Array.from(this.clients.values()).map(client => {
            return {
                state: client.state,
                sId: client.sId
            }
        })

        this.clients.forEach(client => {
            if (client.state == 1) {
                client.notify({
                    cmd: 'clu',
                    list: list
                })
            }
        })
    }
}