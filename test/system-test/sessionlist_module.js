import assert from 'assert'
import ws from 'ws'
import { Client } from '../../system/modules/Client'
import { Session } from '../../system/modules/Session'
import { SessionList } from '../../system/modules/SessionList'
import { isObject, isString } from 'util'


describe('SessionList Module Test', () => {
    let list = new SessionList()    
    let clientA = new Client(new ws('http://localhost'))
    let clientB = new Client(new ws('http://localhost'))
    let session = new Session(clientA, clientB)

    it('does session have own map?', done => {
        assert.equal(list.sessions.constructor.name, 'Map')
        done()
    })

    it('does session added well?', done => {
        list.addSession(session)

        assert.equal(list.isSession(session.sId), true)
        done()
    })

    it('does session got well?', done => {
        assert.equal(isObject(list.getSession(session.sId)), true)
        done()
    })

    it('does session got by client well?', done => {
        assert.equal(isObject(list.getSessionByClientId(clientA.sId)), true)
        done()
    })

    it('does session removed well?', done => {        
        list.removeSession(session.sId)

        assert.equal(list.isSession(session.sId), false)
        done()
    })
})