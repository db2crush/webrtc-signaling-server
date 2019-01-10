'use strict'

/**
 * delbertvibes - WebRTC Signaling Server
 * Session Management Module - Observer
 */

 import { Logger } from '../Logger'

 export class Session extends Logger {
     constructor (caller, callee, sessionList) {
        super ('Session')
        
        this.state = null
        this.id = this.generateId()
        this.clients = new Map()

        if (caller && callee && caller.constructor.name == 'Client' && callee.constructor.name == 'Client') {            
            this.clients.set(caller.sId, caller)
            this.clients.set(callee.sId, callee)

            caller.notify({
                cmd: 'session',
                sessionId: this.id
            })
        }

        if (sessionList && sessionList.constructor.name == 'SessionList') {
            sessionList.addSession(this)
        }
      
     }

     set (state) {
        if (this.state != state) {            
            this.state = state            
            this.broadcast()
        }
     }

     getClient (userId) {
         let user = null

         this.clients.forEach(client => {
             if (client.sId == userId) {
                user = client
             }
         })

         return user
     }

     getOtherClient (userId) {
        let otherClient = null

        this.clients.forEach(client => {
            if (client.sId != userId) {
                otherClient = client
            }
        })
        
        return otherClient
     }
  
     broadcast () {
         this.clients.forEach(client => {
             client.notify({
                 cmd: 'ssu',
                 sessionId: this.id,
                 state: this.state
             })
         })
     }

     generateId () {
        let id = ''
                
        for (let i=0; i < 8; i++) {
            id += Math.floor((Math.random() * 10))
            
        }        
        return id
    }
 }