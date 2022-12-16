import { readFileSync } from 'node:fs'

const sample = readFileSync('sample.txt').toString('utf-8').trimEnd()
const real = readFileSync('real.txt').toString('utf-8').trimEnd()

console.log('sample answer A:', solveA(sample))
console.log('real answer A:', solveA(real))

console.log('sample answer B:', solveB(sample))
console.log('real answer B:', solveB(real))

function solveA(input: string) {
  const [stacksIn, movesIn] = input.split('\n\n').map((v) => v.split('\n'))
  const stacks = new Array(100).fill(0).map(() => []) as string[][]
  for (let i = stacksIn!.length - 2; i >= 0; i--) {
    for (let j = 0; j < stacks.length; j++) {
      const k = 4 * j + 1
      const l = stacksIn![i]!
      if (k < l.length && l[k]! !== ' ') {
        stacks[j]!.push(l[k]!)
      }
    }
  }

  movesIn!.map((l) => {
    const p = l.split(' ')
    const [amt, src, dest] = [Number(p[1]), Number(p[3]) - 1, Number(p[5]) - 1]
    for (let i = 0; i < amt; i++) {
      stacks[dest]!.push(stacks[src]!.pop()!)
    }
  })

  return stacks.map((s) => s[s.length - 1]).join('')
}

function solveB(input: string) {
  const [stacksIn, movesIn] = input.split('\n\n').map((v) => v.split('\n'))
  const stacks = new Array(100).fill(0).map(() => []) as string[][]
  for (let i = stacksIn!.length - 2; i >= 0; i--) {
    for (let j = 0; j < stacks.length; j++) {
      const k = 4 * j + 1
      const l = stacksIn![i]!
      if (k < l.length && l[k]! !== ' ') {
        stacks[j]!.push(l[k]!)
      }
    }
  }

  movesIn!.map((l) => {
    const p = l.split(' ')
    const [amt, src, dest] = [Number(p[1]), Number(p[3]) - 1, Number(p[5]) - 1]
    stacks[dest]!.push(...stacks[src]!.splice(-amt, amt)!)
  })

  return stacks.map((s) => s[s.length - 1]).join('')
}
