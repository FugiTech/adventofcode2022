import { readFileSync } from 'node:fs'

const sample = readFileSync('sample.txt').toString('utf-8').trimEnd()
const real = readFileSync('real.txt').toString('utf-8').trimEnd()

console.log('sample answer A:', solveA(sample))
console.log('real answer A:', solveA(real))

console.log('sample answer B:', solveB(sample))
console.log('real answer B:', solveB(real))

type PacketData = number | PacketData[]

function compare(A: PacketData[], B: PacketData[]): number {
  for (let i = 0, L = Math.min(A.length, B.length); i < L; i++) {
    const [a, b] = [A[i]!, B[i]!]
    if (Array.isArray(a) || Array.isArray(b)) {
      const aa = Array.isArray(a) ? a : [a]
      const bb = Array.isArray(b) ? b : [b]
      const r = compare(aa, bb)
      if (r !== 0) return r
    } else {
      if (a < b) {
        return -1
      }
      if (b < a) {
        return 1
      }
    }
  }
  if (A.length < B.length) {
    return -1
  }
  if (B.length < A.length) {
    return 1
  }
  return 0
}

function solveA(input: string) {
  return input
    .split('\n\n')
    .map<number>((g, idx) => {
      const p = g.split('\n')
      const A = JSON.parse(p[0]!) as PacketData[]
      const B = JSON.parse(p[1]!) as PacketData[]
      return compare(A, B) === -1 ? idx + 1 : 0
    })
    .reduce((a, b) => a + b, 0)
}

function solveB(input: string) {
  const divA = [[2]]
  const divB = [[6]]
  const packets = input
    .split('\n')
    .filter((v) => !!v)
    .map((l) => JSON.parse(l) as PacketData[])
  packets.push(divA, divB)
  packets.sort(compare)
  return (1 + packets.indexOf(divA)) * (1 + packets.indexOf(divB))
}
