import assert from 'assert'
import { ClientList } from '../../system/modules/ClientList'
import { Client } from '../../system/modules/Client'
import { isObject } from 'util'
import ws from 'ws'

describe('ClientList Module Test', () => {
    let list = new ClientList()
    let client = new Client(null, '123', list)    
    let client2 = new Client(null, '123', list)

    it('does client list have own map?', done => {        
        assert.equal(list.clients.constructor.name, 'Map')
        done()
    })

    it('does client list add client well?', done => {
        assert.equal(list.isClient(client.sId), true)
        done()
    })

    it('does client list passive duplicate client well?', done => {
        assert.equal(list.getSize(), 1)
        done()
    })

    it('does client be got from client list?', done => {        
        assert.equal(isObject(list.getClient(client.sId)), true)
        done()
    })

    it('does client removed well?', done => {        
        list.removeClient(client.sId)

        assert.equal(list.isClient(client.sId), false)
        done()
    })
})

