# read-cache

Simple read cache for node with zero dependencies

## Usage

```
const Cache = require('@dougrich/read-cache')

const delay = (timeMs) => new Promise((resolve) => setTimeout(resolve, timeMs))

const asyncActionToDo = async () => {
  await delay(100)
  console.log('called')
  return 5
}

const toDo = new Cache(asyncActionToDo, 200)

await toDo() // returns 5, waits 100ms, logs to console
await toDo() // returns 5, does not wait, does not log to console

await delay(1000) // clears cache while waiting

const [a, b] = await Promise.all(toDo(), toDo()) // returns [5, 5], waits 100ms, logs to console once

const asyncHash = async (arg) => {
  await delay(100)
  console.log(arg)
  return 5
}

const hash = new Cache(asyncHash, 200, (arg) => arg) // alternatively, Cache.concat or Cache.concatSafe can be passed to just concat the parameters

await hash('abc') // returns 5, waits 100ms, logs 'abc' to console
await hash('def') // returns 5, waits 100ms, logs 'def' to console
await hash('abc') // returns 5, does not wait, does not log to console
await hash('def') // returns 5, does not wait, does not log to console
```