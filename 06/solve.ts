import { readFileSync } from 'node:fs'

const sample = readFileSync('sample.txt').toString('utf-8').trimEnd()
const real = readFileSync('real.txt').toString('utf-8').trimEnd()

console.log('sample answer A:', solveA(sample))
console.log('real answer A:', solveA(real))

console.log('sample answer B:', solveB(sample))
console.log('real answer B:', solveB(real))

function solveA(input: string) {
  for (let i = 4; i <= input.length; i++) {
    const s = new Set(input.slice(i - 4, i))
    if (s.size === 4) {
      return i
    }
  }
}

function solveB(input: string) {
  for (let i = 14; i <= input.length; i++) {
    const s = new Set(input.slice(i - 14, i))
    if (s.size === 14) {
      return i
    }
  }
}
