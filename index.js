function deleteKey (key) {
  delete this[key]
}

function cacheFlat () { return '_' }

function cacheConcat (...args) {
  return args.join('|')
}

function cacheConcatSafe (...args) {
  return args.map(x => JSON.stringify(x)).join('|')
}

class HashCache {
  constructor (action, keep, hash) {
    this.cache = {}
    this.action = action
    this.keep = keep
    this.hash = hash
    this.clear = deleteKey.bind(this.cache)
  }

  scheduleClear (key) {
    setTimeout(this.clear, this.keep, key)
  }

  get (...args) {
    const key = this.hash(...args)
    if (!this.cache[key]) {
      this.cache[key] = this.action(...args)
      this.scheduleClear(key)
    }
    return this.cache[key]
  }
}

class Cache {
  constructor (action, keep, hash = cacheFlat) {
    const underlying = new HashCache(action, keep, hash)
    return underlying.get.bind(underlying)
  }
}

Cache.concat = cacheConcat

Cache.concatSafe = cacheConcatSafe

Cache.default = Cache

module.exports = Cache
