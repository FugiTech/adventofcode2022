import { readFileSync } from 'node:fs'

const sample = readFileSync('sample.txt').toString('utf-8').trim()
const real = readFileSync('real.txt').toString('utf-8').trim()

console.log('sample answer A:', solveA(sample))
console.log('real answer A:', solveA(real))

console.log('sample answer B:', solveB(sample))
console.log('real answer B:', solveB(real))

function solveA(input: string) {
  const score = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  return input
    .split('\n')
    .map((l) => {
      const a = new Set(l.slice(0, l.length / 2))
      const b = new Set(l.slice(l.length / 2))
      for (const v of a) {
        if (b.has(v)) {
          return v
        }
      }
      return ''
    })
    .map((c) => score.indexOf(c) + 1)
    .reduce((a, b) => a + b, 0)
}

function solveB(input: string) {
  const score = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  return input
    .split('\n')
    .reduce<Set<string>[][]>((a, v, i) => {
      const k = Math.floor(i / 3)
      if (!a[k]) a[k] = []
      a[k]!.push(new Set(v))
      return a
    }, [])
    .map((g) => {
      for (const v of g[0]!) {
        if ((!g[1] || g[1].has(v)) && (!g[2] || g[2].has(v))) {
          return v
        }
      }
      return ''
    })
    .map((c) => score.indexOf(c) + 1)
    .reduce((a, b) => a + b, 0)
}
