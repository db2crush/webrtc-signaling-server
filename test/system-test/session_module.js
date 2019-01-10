import assert from 'assert'
import ws from 'ws'
import { Client } from '../../system/modules/Client'
import { Session } from '../../system/modules/Session'
import { isString } from 'util'


describe('Session Module Test', () => {
    let clientA = new Client(new ws('http://localhost'), 'A')
    let clientB = new Client(new ws('http://localhost'), 'B')

    let session = new Session(clientA, clientB)

    it('does session have own session sId?', done => {
        assert.equal(isString(session.sId), true)
        done()
    })

    it('does session state is null?', done => {
        assert.equal(session.state, null)
        done()
    })

    it('does session have client A?', done => {
        assert.equal(session.getClient(clientA.sId).sId, clientA.sId)
        done()
    })

    it('does session have client B?', done => {
        assert.equal(session.getClient(clientB.sId).sId, clientB.sId)
        done()
    })

    it('does client A get by client B?', done => {
        assert.equal(session.getOtherClient(clientB.sId).sId, clientA.sId)
        done()
    })

    it('does client B get by client A?', done => {
        assert.equal(session.getOtherClient(clientA.sId).sId, clientB.sId)
        done()
    })
})