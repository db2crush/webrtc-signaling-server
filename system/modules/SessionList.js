/**
 * delbertvibes - WebRTC Signaling Server
 * SessionList Management Module - Observer Subject (Observable)
 */

import { Logger } from '../Logger'

 export class SessionList extends Logger {
    constructor () {
       super('SessionList')
       this.sessions = new Map()
    }

    addSession (session) {
        if (!this.isSession(session.id)) {
            super.log(session.id + ' added to session list.')
            this.sessions.set(session.id, session)
        } else {
            super.error(session.id + 'already existed on session list.')
        }
    }

    removeSession (sessionId) {
        super.log(sessionId + ' removed from session list.')
        this.sessions.delete(sessionId)
    }

    isSession (sessionId) {
        return this.sessions.has(sessionId)
    }

    getSession (sessionId) {
        if (this.isSession(sessionId)) {
            return this.sessions.get(sessionId)
        } else {
            return null
        }
    }

    getSessionByClientId (clientId) {
        let session = null

        this.sessions.forEach(item => {
            item.clients.forEach(client => {
                if (client.sId == clientId) {
                    session = item
                }
            })
        })
        return session
    }

    getSize () {
        return this.sessions.size
    }
 }