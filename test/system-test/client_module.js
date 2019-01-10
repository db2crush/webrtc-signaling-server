import assert from 'assert'
import { Client } from '../../system/modules/Client'

describe('Client Module Test', () => {    
    let client = new Client()    

    it('does client`s state is 1?', done => {
        assert.equal(client.state, 1)
        done()
    })
})

