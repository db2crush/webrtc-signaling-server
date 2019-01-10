/**
 * delbertvibes - WebRTC Signaling Server
 * websocket message receiver
 */

export async function connectionClosedReceiver(ws, code) {
    if (ws.hasOwnProperty('sId')) {
        this.processor.createLeave(ws.sId)
    }
}

export async function connectionErrorReceiver(ws, err) {
    
}

export async function messageReceiver(ws, msg) {
    try {
        const parsed = await parse(msg)        
        const checked = await check(parsed)        
        const converted = await convert(checked)

        if (converted.cmd != 'sId' && !ws.hasOwnProperty('sId')) throw 9100
        else if (converted.cmd != 'sId' && (converted.opponentId == ws.sId)) throw 9200

        switch (converted.cmd) {
            case 'sId':
                this.processor.createClient(ws, converted.sId)
                break

            case 'session':
                this.processor.createSession(ws.sId, converted.opponentId)
                break

            case 'notify':
                this.processor.createNotification(ws.sId, converted.opponentId, converted.type)
                break

            case 'call':
                this.processor.createCall(ws.sId, converted.sessionId, converted.offer)
                break

            case 'accept':
                this.processor.createAccept(ws.sId, converted.sessionId, converted.answer)
                break

            case 'stop':
                this.processor.createStop(ws.sId, converted.sessionId)
                break

            case 'reject':
                this.processor.createReject(ws.sId, converted.sessionId)
                break

            case 'icecandidate':
                this.processor.createIcecandidate(ws.sId, converted.sessionId, converted.icecandidate)
                break

            default:
                throw 9002
        }
    } catch (code) {
        ws.send(JSON.stringify({
            cmd: 'error',
            code: code
        }))
    }
}

function parse(msg) {
    return new Promise((resolve, reject) => {
        try {
            resolve(JSON.parse(msg))
        } catch (e) {
            reject(9000)
        }
    })
}

function check(msg) {
    return new Promise((resolve, reject) => {
        if (!msg) reject(9001)
        else if (!msg.hasOwnProperty('cmd')) reject(9001)
        else resolve(msg)
    })
}

function convert(msg) {
    return new Promise((resolve, reject) => {
        for (let [key, value] of Object.entries(msg)) {
            if (typeof (value) == 'number') msg[key] = value.toString()
            else if (typeof (value) == 'string') msg[key] = value.trim()
        }
        resolve(msg)
    })
}