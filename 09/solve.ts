import { readFileSync } from 'node:fs'

const sample = readFileSync('sample.txt').toString('utf-8').trimEnd()
const real = readFileSync('real.txt').toString('utf-8').trimEnd()

console.log('sample answer A:', solveA(sample))
console.log('real answer A:', solveA(real))

console.log('sample answer B:', solveB(sample))
console.log('real answer B:', solveB(real))

type Point = { x: number; y: number }
type Tuple<T, N extends number, R extends readonly T[] = []> = R['length'] extends N ? R : Tuple<T, N, readonly [T, ...R]>

function solveA(input: string) {
  const H = { x: 0, y: 0 }
  const T = { x: 0, y: 0 }
  const visited = new Set<string>()
  visited.add(JSON.stringify(T))
  input.split('\n').map((l) => {
    const p = l.split(' ')
    const [dir, amt] = [p[0]!, Number(p[1])]
    for (let i = 0; i < amt; i++) {
      switch (dir) {
        case 'U':
          H.y--
          break
        case 'L':
          H.x--
          break
        case 'D':
          H.y++
          break
        case 'R':
          H.x++
          break
      }
      if (!closeEnough(H, T)) {
        T.x += (H.x - T.x) / (Math.abs(H.x - T.x) || 1)
        T.y += (H.y - T.y) / (Math.abs(H.y - T.y) || 1)
      }
      visited.add(JSON.stringify(T))
    }
  })
  return visited.size
}

function solveB(input: string) {
  const knots: Tuple<Point, 10> = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ]
  const visited = new Set<string>()
  visited.add(JSON.stringify(knots[9]))
  input.split('\n').map((l) => {
    const p = l.split(' ')
    const [dir, amt] = [p[0]!, Number(p[1])]
    for (let i = 0; i < amt; i++) {
      switch (dir) {
        case 'U':
          knots[0].y--
          break
        case 'L':
          knots[0].x--
          break
        case 'D':
          knots[0].y++
          break
        case 'R':
          knots[0].x++
          break
      }

      for (let j = 1; j < knots.length; j++) {
        const H = knots[j - 1]!
        const T = knots[j]!
        if (!closeEnough(H, T)) {
          T.x += (H.x - T.x) / (Math.abs(H.x - T.x) || 1)
          T.y += (H.y - T.y) / (Math.abs(H.y - T.y) || 1)
        }
      }

      visited.add(JSON.stringify(knots[9]))
    }
  })
  return visited.size
}

function closeEnough(a: Point, b: Point) {
  return Math.abs(a.x - b.x) <= 1 && Math.abs(a.y - b.y) <= 1
}
