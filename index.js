import Server from './server/Server'
import { System } from './system/System'
import { Config } from './config'

const server = new Server(Config.protocol, Config.port, Config.cluster)

server.start().then((res) => {
    new System(res.wss).start().catch(e => {
        console.log('\x1b[31m%s\x1b[0m', e)
    })
})
