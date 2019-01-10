import assert from 'assert'
import Server from '../../server/Server'
import http from 'http'
describe('Server Test', () => {
    describe('http test', () => {
        describe('created?', () => {
            let server = new Server()
            before(() => {
                server.start('http')
            })
        
            it('should return 200', done => {
                http.get('http://localhost:90', res => {
                    assert.equal(res.statusCode, 200)
                    done()
                })
            })        
    
            after(() => {
                server.server.close()
            })
        })
    })
})
