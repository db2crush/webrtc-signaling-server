import assert from 'assert'
import ws from 'ws'
import os from 'os'
import { Config }from '../../config'
import Server from '../../server/Server'
import { System } from '../../system/System'

var wsA, wsB, sessionId
const server = new Server(Config.protocol, Config.port, false)
server.start().then(res => {
    wsA = new ws(process.env.protocol + '://' + getServerIp() + ':' + process.env.port)
    wsB = new ws(process.env.protocol + '://' + getServerIp() + ':' + process.env.port)
   
    new System(res.wss).start()
    .catch(e => {
        console.log('\x1b[31m%s\x1b[0m', e)
    })
})

describe('Signaling Test', () => {
    describe('create', () => {
        it('does A get id well?', done => {
            let message = {
                cmd: 'sId',
                sId: 'A'
            }
    
            wsA.once('message', (message) => {                
                assert.equal(parse(message).sId, 'A')
                done()
            })
            wsA.send(stringify(message))
        })
    
        it('does B get sId well?', done => {
            let message = {
                cmd: 'sId',
                sId: 'B'
            }
            wsB.once('message', (message) => {
                assert.equal(parse(message).sId, 'B')
                done()
            })
            wsB.send(stringify(message))
        })
    
        it('does A create session with B well?', done => {
            let message = {
                cmd: 'session',
                opponentId: 'B'
            }
            wsA.once('message', (message) => {
                assert.notEqual(parse(message).sessionId, null)
                sessionId = parse(message).sessionId
                done()
            })
            wsA.send(stringify(message))
        })
    })

    describe('call & reject,stop', () => {
        it('does A call to B well?', done => {
            let message = {
                cmd: 'call',
                sessionId: sessionId,
                offer: null
            }
            wsB.once('message', (message) => {
                assert.equal(parse(message).cmd, 'call')
                done()
            })        
            wsA.send(stringify(message))
        })

        it('does A reject&stop to B well?', done => {
            let message = {
                cmd: 'stop',
                sessionId: sessionId
            }
            wsB.once('message', (message) => {
                assert.equal(parse(message).cmd, 'stop')
                done()
            })        
            wsA.send(stringify(message))
        })
    })

    describe('session&leave, leave', () => {
        it('does A create session with B well?', done => {
            let message = {
                cmd: 'session',
                opponentId: 'B'
            }
            wsA.once('message', (message) => {
                assert.notEqual(parse(message).sessionId, null)
                sessionId = parse(message).sessionId
                done()
            })
            wsA.send(stringify(message))
        })

        it('does A leave to B well when session&leave?', done => {
            wsB.once('message', (message) => {
                assert.equal(parse(message).cmd, 'leave')
                done()
            })
            wsA.close()
        })

        it('does B leave well?', done => {
            wsB.close()
            done()
        })
    })
})

function getServerIp() {
    var ifaces = os.networkInterfaces();
    var result = '';
    for (var dev in ifaces) {
        var alias = 0;
        ifaces[dev].forEach(function(details) {
            if (details.family == 'IPv4' && details.internal === false) {
                result = details.address;
                ++alias;
            }
        });
    }
  
    return result;
}

function stringify(message) {
    return JSON.stringify(message)
}

function parse(message) {
    return JSON.parse(message)
}

