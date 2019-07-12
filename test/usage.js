const { expect } = require('chai')

describe('usage test', () => {
  it('behaves as expected', async () => {
    const Cache = require('..')
    const value = Symbol('test-return')
    const timeout = 100

    const delay = (timeMs) => new Promise((resolve) => setTimeout(resolve, timeMs))
    let callCount = 0
    const reset = () => { callCount = 0 }

    const asyncActionToDo = async () => {
      await delay(timeout)
      callCount++
      return value
    }

    const toDo = new Cache(asyncActionToDo, timeout * 3)

    expect(await toDo()).to.equal(value)
    expect(callCount).to.equal(1)
    reset()
    expect(await toDo()).to.equal(value)
    expect(callCount).to.equal(0)
    reset()

    await delay(1000) // clears cache while waiting

    const [a, b] = await Promise.all([toDo(), toDo()]) // returns [5, 5], waits 100ms, logs to console once

    expect(a).to.equal(value)
    expect(b).to.equal(value)
    expect(callCount).to.equal(1)
    reset()

    const asyncHash = async () => {
      await delay(timeout)
      callCount++
      return value
    }

    const hash = new Cache(asyncHash, timeout * 3, (arg) => arg) // alternatively, Cache.concat or Cache.concatSafe can be passed to just concat the parameters

    expect(await hash('abc')).to.equal(value)
    expect(await hash('def')).to.equal(value)
    expect(await hash('abc')).to.equal(value)
    expect(await hash('def')).to.equal(value)
    expect(callCount).to.equal(2)
  })
})
