/**
 * delbertvibes - WebRTC Signaling Server
 * Server Helper Module
 */

import { Config } from './Config'

export class Logger {
    constructor (name) {
        this.name = name
        console.group()
        console.log('trace::' + this.name + ' created.')
        console.groupEnd()
    }

    getName () {
        return this.name
    }

    /**     
     * @param {string} text 
     */
    log (text) {
        if (Config.debug) {
            console.group()
            console.log('log::' + this.name + ':: ' + text)
            console.groupEnd()
        }
    }

    /**     
     * @param {string} text 
     * @param {number} code 
     */
    error (text, code) {
        if (Config.debug) {
            console.group()
            console.error('\x1b[31m%s\x1b[0m', 'error[' + code + ']::' + this.name + ' '+ text)
            console.groupEnd()
        }
    }
}