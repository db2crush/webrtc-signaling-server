import assert from 'assert'
import ws from 'ws'
import os from 'os'
import Server from '../../server/Server'
import { System } from '../../system/System'
import { Config } from '../../config'

let server = null
let system = null

server = new Server()
server.start(Config.protocol).then((sv) => {
    system = new System(sv.wss)
    system.start()
    .then(() => {

    })
    .catch(e => {
        console.log(e)
    })
})

describe('System Test', () => {
    describe('create system', () => {
        it('does system have own websocket server?', done => {
            assert.equal(system.wss.constructor.name, 'WebSocketServer')
            done()
        })

        it('does system notice client connected ?', done => {
            let sk = new ws(process.env.protocol + '://' + getServerIp() + ':' + process.env.port)

            sk.on('open', _ => {
                done()
            })
        })

        it('does system notice client disconnected ?', done => {
            let sk = new ws(process.env.protocol + '://' + getServerIp() + ':' + process.env.port)

            sk.on('open', _ => {
                sk.send(JSON.stringify({
                    cmd: 'id',
                    id: '1234'
                }))
                sk.close()
            })

            sk.on('close', event => {
                if (event) {
                    done()
                }                
            })
        })

        it('does client get message from system ?', done => {
            let sk = new ws(process.env.protocol + '://' + getServerIp() + ':' + process.env.port)

            sk.on('open', _ => {
                sk.send(JSON.stringify({
                    cmd: 'id',
                    id: '1234'
                }))
            })     

            sk.on('message', msg => {
                let message = JSON.parse(msg)
                if (message.cmd == 'id') {
                    done()
                }                
            })
        })
    })

    after(() => {
        server.server.close()
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