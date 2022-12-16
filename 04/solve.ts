import { readFileSync } from 'node:fs'

const sample = readFileSync('sample.txt').toString('utf-8').trim()
const real = readFileSync('real.txt').toString('utf-8').trim()

console.log('sample answer A:', solveA(sample))
console.log('real answer A:', solveA(real))

console.log('sample answer B:', solveB(sample))
console.log('real answer B:', solveB(real))

function solveA(input: string) {
  return input
    .split('\n')
    .map<number>((l) => {
      const [[a, b], [c, d]] = l.split(',').map((p) => p.split('-').map((v) => Number(v))) as [[number, number], [number, number]]
      return (a <= c && d <= b) || (c <= a && b <= d) ? 1 : 0
    })
    .reduce((a, b) => a + b, 0)
}

function solveB(input: string) {
  return input
    .split('\n')
    .map<number>((l) => {
      const [[a, b], [c, d]] = l.split(',').map((p) => p.split('-').map((v) => Number(v))) as [[number, number], [number, number]]
      return (a <= c && c <= b) || (a <= d && d <= b) || (c <= a && a <= d) || (c <= b && b <= d) ? 1 : 0
    })
    .reduce((a, b) => a + b, 0)
}
