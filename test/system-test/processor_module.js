import assert from 'assert'
import { Processor } from '../../system/modules/Processor'

import ws from 'ws'
import { isString } from 'util';


describe('Processor Module Test', () => {
    let processor = new Processor()

    it('does processor hold client and session processor?', done => {
        assert.equal(processor.clientProcessor.constructor.name, 'ClientProcessor')
        assert.equal(processor.sessionProcessor.constructor.name, 'SessionProcessor')
        done()
    })

    it('does processor create client well?', done => {
        let websocketA = new ws('http://localhost')
        let websocketB = new ws('http://localhost')
        processor.createClient(websocketA, 'A')
        processor.createClient(websocketB, 'B')

        assert.equal(processor.clientProcessor.get('A').sId, 'A')
        done()
    })

    it('does processor create session well?', done => {
        processor.createSession('A', 'B')

        assert.equal(isString(processor.sessionProcessor.getByClientId('A').sId), true)
        done()
    })

    it('does processor create call, stop, reject, accept and icecandidate well?', done => {
        processor.createCall('A', processor.sessionProcessor.getByClientId('A').sId, null)

        setTimeout(() => {
            assert.equal(processor.sessionProcessor.getByClientId('A'), null)    
        }, 100);
        
        done()
    })

    it('does processor create leave well?', done => {
        processor.createLeave('A')

        setTimeout(() => {
            assert.equal(processor.sessionProcessor.getByClientId('A'), null)
        }, 100)

        done()
    })
})

