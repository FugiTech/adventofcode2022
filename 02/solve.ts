import { readFileSync } from 'node:fs'

const sample = readFileSync('sample.txt').toString('utf-8').trim()
const real = readFileSync('real.txt').toString('utf-8').trim()

console.log('sample answer A:', solveA(sample))
console.log('real answer A:', solveA(real))

console.log('sample answer B:', solveB(sample))
console.log('real answer B:', solveB(real))

function solveA(input: string) {
  const baseScore = {
    X: 1,
    Y: 2,
    Z: 3,
  }
  const winScore = {
    'A X': 3,
    'A Y': 6,
    'A Z': 0,
    'B X': 0,
    'B Y': 3,
    'B Z': 6,
    'C X': 6,
    'C Y': 0,
    'C Z': 3,
  }
  return input
    .split('\n')
    .map((l) => {
      return baseScore[l.split(' ')[1]] + winScore[l]
    })
    .reduce((a, b) => a + b, 0)
}

function solveB(input: string) {
  const baseScore = {
    X: 0,
    Y: 3,
    Z: 6,
  }
  const winScore = {
    'A X': 3,
    'A Y': 1,
    'A Z': 2,
    'B X': 1,
    'B Y': 2,
    'B Z': 3,
    'C X': 2,
    'C Y': 3,
    'C Z': 1,
  }
  return input
    .split('\n')
    .map((l) => {
      return baseScore[l.split(' ')[1]] + winScore[l]
    })
    .reduce((a, b) => a + b, 0)
}
