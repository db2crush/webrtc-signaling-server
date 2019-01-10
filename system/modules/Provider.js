/**
 * delbertvibes - WebRTC Signaling Server
 * WebRTC Module (WebRTC Signaling Message Provider)
 */

 /**
  * 
  * @param {websocket} ws 
  * @param {string} cmd 
  * @param {object} contents 
  */
 export function sendMessage (ws, message) {
    return new Promise((resolve, reject) => {
        if (ws && ws.constructor.name == 'WebSocket') {
            if (ws.readyState == 1) {
                ws.send(JSON.stringify(message), (err) => {        
                    if (err) {
                        reject(9400)
                    } else {
                        resolve()
                    }
                })
            } else {
                reject(9401)
            }
        } else {
            reject(9402)
        }
    })
 }
