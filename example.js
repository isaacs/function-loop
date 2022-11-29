//import loop from 'function-loop'
// or `const {default:loop} = require('function-loop')
const loop = require('./dist/cjs/index.js').default

// synchronous usage
const list = [
  () => console.log(1),
  () => console.log(2),
  () => console.log(3),
]
const result = loop(list, () => {
  console.log('done')
  return true
}, (er) => {
  console.error('threw somehow', er)
})

console.log('result:', result)
// logs:
// 1
// 2
// 3
// done
// result: true

// asynchronous usage
const plist = [
  async () => console.log(1),
  async () => new Promise(resolve => setTimeout(resolve, 100)).then(() =>
    console.log(2)
  ),
  async () => console.log(3),
]
const presult = loop(plist, () => {
  console.log('done')
  return true
}, (er) => {
  console.error('threw somehow', er)
})

console.log('result:', presult)
presult.then(() => console.log('resolved'))
// logs:
// 1
// result: Promise { <pending> }
// 3
// 2
// resolved
