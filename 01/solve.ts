import { readFileSync } from 'node:fs'

const sample = readFileSync('sample.txt').toString('utf-8').trim()
const real = readFileSync('real.txt').toString('utf-8').trim()

console.log('sample answer A:', solveA(sample))
console.log('real answer A:', solveA(real))

console.log('sample answer B:', solveB(sample))
console.log('real answer B:', solveB(real))

function solveA(input: string) {
  const cals = input
    .split('\n\n')
    .map((s) =>
      s
        .split('\n')
        .map((l) => Number(l))
        .reduce((a, b) => a + b, 0),
    )
    .sort((a, b) => b - a)
  return cals[0]
}

function solveB(input: string) {
  const cals = input
    .split('\n\n')
    .map((s) =>
      s
        .split('\n')
        .map((l) => Number(l))
        .reduce((a, b) => a + b, 0),
    )
    .sort((a, b) => b - a)
  return cals[0] + cals[1] + cals[2]
}
