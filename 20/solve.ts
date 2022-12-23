import { readFileSync } from 'node:fs'

const sample = readFileSync('sample.txt').toString('utf-8').trimEnd()
const real = readFileSync('real.txt').toString('utf-8').trimEnd()

console.log('sample answer A:', solveA(sample))
console.log('real answer A:', solveA(real))

console.log('sample answer B:', solveB(sample))
console.log('real answer B:', solveB(real))

function solveA(input: string) {
  const list = input.split('\n').map((l, i) => ({ k: i, v: Number(l) }))
  let reordered = [...list]
  for (const { k, v } of list) {
    const i = reordered.findIndex((o) => o.k === k)
    reordered.splice((i + v) % (list.length - 1), 0, ...reordered.splice(i, 1))
    // console.log(reordered.map((o) => o.v))
  }
  const Z = reordered.findIndex((o) => o.v === 0)
  return reordered[(Z + 1000) % reordered.length]!.v + reordered[(Z + 2000) % reordered.length]!.v + reordered[(Z + 3000) % reordered.length]!.v
}

function solveB(input: string) {
  const list = input.split('\n').map((l, i) => ({ k: i, v: Number(l) * 811589153 }))
  let reordered = [...list]
  for (let R = 0; R < 10; R++) {
    for (const { k, v } of list) {
      const i = reordered.findIndex((o) => o.k === k)
      reordered.splice((i + v) % (list.length - 1), 0, ...reordered.splice(i, 1))
      // console.log(reordered.map((o) => o.v))
    }
  }
  const Z = reordered.findIndex((o) => o.v === 0)
  return reordered[(Z + 1000) % reordered.length]!.v + reordered[(Z + 2000) % reordered.length]!.v + reordered[(Z + 3000) % reordered.length]!.v
}
