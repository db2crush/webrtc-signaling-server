/**
 * delbertvibes - WebRTC Signaling Server
 * WebRTC Module (WebRTC Signaling Session Processor)
 */

import { Logger } from '../Logger'

import { Session } from './Session'
import { SessionList } from './SessionList'

import { ClientState } from './ClientState'

export class SessionProcessor extends Logger {
    constructor() {
        super('SessionProcessor')

        this.list = new SessionList()
    }

    create(user, opponent) {       
        super.log('create session containing ' + user.sId + ' and ' + opponent.sId + '.')
        return new Session(user, opponent, this.list)
    }

    remove(sessionId) {
        super.log('remove session ' + sessionId + '.')
        this.list.removeSession(sessionId)
    }

    get(sessionId) {
        return this.list.getSession(sessionId)
    }

    getByClientId (clientId) {
        return this.list.getSessionByClientId(clientId)
    }

    update (sessionId, state) {
        super.log('update session ' + sessionId + ' to ' + state + '.') 
        let session = this.get(sessionId)
       
        switch (state) {
            case 1:
                // NEW
                session.clients.forEach(client => {
                    client.set(ClientState.CALLING)
                })
                break
            case 2:
                // PENDING
                // clients are already on calling state
                // session.clients.forEach(client => {
                //     client.set(ClientState.CALLING)
                // })
                break

            case 3: 
                // ACTIVE
                // clients are already on calling state
                // session.clients.forEach(client => {
                //     client.set(ClientState.CALLING)
                // })
                break 

            case 4:
                // CLOSED
                session.clients.forEach(client => {
                    client.set(ClientState.WAIT)
                })
                break
        }
        session.set(state)
    }
}
