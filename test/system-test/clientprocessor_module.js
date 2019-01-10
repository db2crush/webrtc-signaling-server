import assert from 'assert'
import { ClientProcessor } from '../../system/modules/ClientProcessor'
import ws from 'ws'
describe('ClientProcessor Module Test', () => {
    let processor = new ClientProcessor()
    let client = processor.create(new ws('http://localhost'), '123')

    it('does processor has own clientList?', done => {        
        assert.equal(processor.list.constructor.name, 'ClientList')
        done()
    })

    it('does processor create client well?', done => {
        assert.equal(processor.get(client.sId).constructor.name, 'Client')
        done()
    })

    it('does processor remove client well?', done => {
        processor.remove(client.sId)
        
        assert.equal(processor.get(client.sId), null)
        done()
    })

    
})

