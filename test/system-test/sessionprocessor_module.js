import assert from 'assert'
import { SessionProcessor } from '../../system/modules/SessionProcessor'
import { Client } from '../../system/modules/Client'
import ws from 'ws'

describe('SessionProcessor Module Test', () => {
    describe('Create Test', () => {
        let processor = new SessionProcessor()    
        let clientA = new Client(new ws('http://localhost'), 'A')
        let clientB = new Client(new ws('http://localhost'), 'B')
        let session = null

        it('does processor has own sessionlist?', done => {        
            assert.equal(processor.list.constructor.name, 'SessionList')
            done()
        })

        it('does processor create session well?', done => {
            session = processor.create(clientA, clientB)

            assert.equal(processor.get(session.id).constructor.name, 'Session')
            done()
        })
    })

    describe('Update Test', () => {
        describe('to NEW', () => {
            let processor = new SessionProcessor()    
            let clientA = new Client(new ws('http://localhost'), 'A')
            let clientB = new Client(new ws('http://localhost'), 'B')
            let session = processor.create(clientA, clientB)
            processor.update(session.id, 1)

            it('does processor update session to NEW well?', done => {                
                assert.equal(processor.get(session.id).state, 1)
                done()
            })

            it('does processor update clients on session to CALLING well?', done => {
                assert.equal(clientA.state, 2)
                assert.equal(clientB.state, 2)
                done()
            })
        })

        describe('to PENDING', () => {
            let processor = new SessionProcessor()    
            let clientA = new Client(new ws('http://localhost'), 'A')
            let clientB = new Client(new ws('http://localhost'), 'B')
            let session = processor.create(clientA, clientB)
            processor.update(session.id, 1)
            processor.update(session.id, 2)

            it('does processor update session to PENDING well?', done => {        
                assert.equal(processor.get(session.id).state, 2)
                done()
            })

            it('does processor maintain state of clients on session well?', done => {
                assert.equal(clientA.state, 2)
                assert.equal(clientB.state, 2)
                done()
            })
        })

        describe('to ACTIVE', () => {
            let processor = new SessionProcessor()    
            let clientA = new Client(new ws('http://localhost'), 'A')
            let clientB = new Client(new ws('http://localhost'), 'B')
            let session = processor.create(clientA, clientB)
            processor.update(session.id, 1)
            processor.update(session.id, 3)

            it('does processor update session to ACTIVE well?', done => {
                assert.equal(processor.get(session.id).state, 3)
                done()
            })

            it('does processor maintain state of clients on session well?', done => {
                assert.equal(clientA.state, 2)
                assert.equal(clientB.state, 2)
                done()
            })
        })

        describe('to CLOSED', () => {
            let processor = new SessionProcessor()    
            let clientA = new Client(new ws('http://localhost'), 'A')
            let clientB = new Client(new ws('http://localhost'), 'B')
            let session = processor.create(clientA, clientB)
            processor.update(session.id, 1)
            processor.update(session.id, 4)

            it('does processor update session to CLOSED well?', done => {
                assert.equal(processor.get(session.id).state, 4)
                done()
            })

            it('does processor update clients on session to WAIT well?', done => {
                assert.equal(clientA.state, 1)
                assert.equal(clientB.state, 1)
                done()
            })
        })
    })  

    describe('Remove Test', () => {
        let processor = new SessionProcessor()    
        let clientA = new Client(new ws('http://localhost'), 'A')
        let clientB = new Client(new ws('http://localhost'), 'B')
        let session = processor.create(clientA, clientB)

        it('does processor remove session well?', done => {
            processor.remove(session.id)
            
            assert.equal(processor.get(session.id), null)
            done()
        })
    })

})