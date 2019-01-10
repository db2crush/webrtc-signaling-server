/**
 * delbertvibes - WebRTC Signaling Server
 * WebRTC Module (WebRTC Signaling Processor)
 */

import {
    Logger
} from '../Logger'

import {
    SessionProcessor
} from './SessionProcessor'
import {
    ClientProcessor
} from './ClientProcessor'

import {
    SessionState
} from './SessionState'

import {
    SignalingTypes
} from './Types'

export class Processor extends Logger {
    constructor() {
        super('Processor')

        this.clientProcessor = new ClientProcessor()
        this.sessionProcessor = new SessionProcessor()

    }

    /**
     * @param {websocket} ws 
     * @param {string} sId
     * @description create client
     */
    createClient(ws, sId) {
        let client = this.clientProcessor.get(sId)

        try {
            if (ws.hasOwnProperty('sId')) {
                throw 9101
            } else if (!client) {
                this.clientProcessor.create(ws, sId)
            } else {
                throw 9102
            }
        } catch (code) {
            ws.send(JSON.stringify({
                cmd: 'error',
                code: code
            }), err => {
                if (err) super.error(err, 9400)
            })
        }
    }

    /**
     * 
     * @param {string} userId 
     * @param {string} opponentId 
     */
    createSession(userId, opponentId) {
        let user = this.clientProcessor.get(userId)
        let opponent = this.clientProcessor.get(opponentId)

        try {
            if (user == opponent) {
                throw 9200
            } else if (!opponent) {
                throw 9201
            } else if (user.state == 2) {
                throw 9202
            } else if (opponent.state == 2) {
                throw 9203
            } else {
                let session = this.sessionProcessor.create(user, opponent)
                this.sessionProcessor.update(session.id, SessionState.NEW)
                this.clientProcessor.update()
            }
        } catch (code) {
            user.notify({
                cmd: 'error',
                code: code
            })
        }
    }

    /**
     * 
     * @param {string} userId 
     * @param {string} opponentId 
     * @param {string} type
     * @description
     * type means notification type: 1,2,3...
     */
    createNotification(userId, opponentId, type) {
        let user = this.clientProcessor.get(userId)
        let opponent = this.clientProcessor.get(opponentId)

        try {
            if (user == opponent) {
                throw 9300
            } else if (!opponent) {
                throw 9301
            } else {
                opponent.notify({
                    cmd: 'notify',
                    opponentId: userId,
                    type: type
                })
            }
        } catch (code) {
            user.notify({
                cmd: 'error',
                code: code
            })
        }
    }

    /**
     * 
     * @param {string} userId 
     * @param {string} sessionId 
     * @param {object} offer 
     */
    createCall(userId, sessionId, offer) {
        this._preprocess(userId, sessionId, session => {
            if (!session) return
            else {
                let user = session.getClient(userId)
                let opponent = session.getOtherClient(userId)

                opponent.notify({
                    cmd: SignalingTypes.CALL,
                    sessionId: sessionId,
                    opponentId: userId,
                    offer: offer
                }, code => {
                    if (code) {
                        super.error('can not create call.', code)

                        this.sessionProcessor.update(sessionId, SessionState.CLOSED)
                        this.sessionProcessor.remove(sessionId)

                        user.notify({
                            cmd: 'error',
                            code: code
                        })
                    } else {
                        this.sessionProcessor.update(sessionId, SessionState.PENDING)
                    }
                })
            }
        })
    }

    /**
     * @param {string} userId
     * @param {string} sessionId
     * @param {sdp} answer 
     */
    createAccept(userId, sessionId, answer) {
        this._preprocess(userId, sessionId, session => {
            if (!session) return
            else {
                let user = session.getClient(userId)
                let opponent = session.getOtherClient(userId)

                opponent.notify({
                    cmd: SignalingTypes.ACCEPT,
                    sessionId: sessionId,
                    opponentId: userId,
                    answer: answer
                }, code => {
                    if (code) {
                        super.error('can not create accept. ' + code)

                        this.sessionProcessor.update(sessionId, SessionState.CLOSED)
                        this.sessionProcessor.remove(sessionId)

                        user.notify({
                            cmd: 'error',
                            code: code
                        })
                    } else {
                        this.sessionProcessor.update(sessionId, SessionState.ACTIVE)
                    }
                })
            }
        })
    }

    /**
     * 
     * @param {string} userId
     * @param {string} opponentId
     * @param {object} icecandidate
     */
    createIcecandidate(userId, sessionId, icecandidate) {
        this._preprocess(userId, sessionId, session => {
            if (!session) return
            else {
                let user = session.getClient(userId)
                let opponent = session.getOtherClient(userId)

                opponent.notify({
                    cmd: SignalingTypes.ICECANDIDATE,
                    sessionId: sessionId,
                    opponentId: userId,
                    icecandidate: icecandidate
                }, code => {
                    if (code) {
                        super.error('can not create icecandidate. ', code)

                        this.sessionProcessor.update(sessionId, SessionState.CLOSED)
                        this.sessionProcessor.remove(sessionId)

                        user.notify({
                            cmd: 'error',
                            code: code
                        })
                    }
                })
            }
        })
    }

    /**
     * 
     * @param {string} userId 
     * @param {string} sessionId 
     */
    createStop(userId, sessionId) {
        this._preprocess(userId, sessionId, session => {
            if (!session) return
            else {
                let user = session.getClient(userId)
                let opponent = session.getOtherClient(userId)

                opponent.notify({
                    cmd: SignalingTypes.STOP,
                    sessionId: sessionId,
                    opponentId: userId
                }, code => {
                    if (code) {
                        super.error('can not create stop. ', code)

                        user.notify({
                            cmd: 'error',
                            code: code
                        })
                    }

                    this.sessionProcessor.update(sessionId, SessionState.CLOSED)
                    this.clientProcessor.update()
                    this.sessionProcessor.remove(sessionId)
                })
            }
        })
    }

    /**
     * 
     * @param {string} userId 
     * @param {string} sessionId 
     */
    createReject(userId, sessionId) {
        this._preprocess(userId, sessionId, session => {
            if (!session) return
            else {
                let user = session.getClient(userId)
                let opponent = session.getOtherClient(userId)

                opponent.notify({
                    cmd: SignalingTypes.REJECT,
                    sessionId: sessionId,
                    opponentId: userId
                }, code => {
                    if (code) {
                        super.error('can not create reject. ', code)

                        user.notify({
                            cmd: 'error',
                            code: code
                        })
                    }

                    this.sessionProcessor.update(sessionId, SessionState.CLOSED)
                    this.clientProcessor.update()
                    this.sessionProcessor.remove(sessionId)
                })
            }
        })
    }

    /**
     * 
     * @param {string} userId 
     */
    createLeave(userId) {
        let user = this.clientProcessor.get(userId)
        let opponent = null
        let session = null

        if (user.state == 2) {
            session = this.sessionProcessor.getByClientId(userId)
            opponent = session.getOtherClient(userId)

            opponent.notify({
                cmd: SignalingTypes.LEAVE,
                sessionId: session.id,
                opponentId: userId
            }, code => {
                if (code) {
                    super.error('can not create leave. ', code)
                }
                
                this.sessionProcessor.update(session.id, SessionState.CLOSED)
                this.clientProcessor.update()
                this.sessionProcessor.remove(session.id)
                this.clientProcessor.remove(userId)
            })
        } else {
            this.clientProcessor.remove(userId)
        }
    }

    _preprocess(userId, sessionId, callback) {
        let session = this.sessionProcessor.get(sessionId)

        if (!session) {
            let user = this.clientProcessor.get(userId)

            user.notify({
                cmd: 'error',
                code: 9204
            })

            return callback instanceof Function && callback()
        } else {
            return callback instanceof Function && callback(session)
        }
    }
}