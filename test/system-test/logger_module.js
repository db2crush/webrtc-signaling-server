import assert from 'assert'
import { Logger } from '../../system/Logger'

describe('Logger Test', () => {
    it('name test', () => {
        let M = new Logger('delbertvibes')
        assert.equal(M.getName(), 'delbertvibes')
    })
})
