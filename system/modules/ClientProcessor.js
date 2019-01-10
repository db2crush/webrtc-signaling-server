/**
 * delbertvibes - WebRTC Signaling Server
 * WebRTC Module (WebRTC Signaling Client Processor)
 */

 import { Logger } from '../Logger' 

 import { Client } from './Client'
 import { ClientList } from './ClientList'

 export class ClientProcessor extends Logger {
    constructor () {
        super('ClientProcessor')
      
        this.list = new ClientList()
    }

    create (ws, sId) {
        super.log('create client ' + sId + '.')
        return new Client(ws, sId, this.list)
    }

    remove (sId) {
        super.log('remove client ' + sId + '.')
        this.list.removeClient(sId)
    }

    get (sId) {
        return this.list.getClient(sId)
    }

    update () {
        this.list.broadCast()
    }
 }