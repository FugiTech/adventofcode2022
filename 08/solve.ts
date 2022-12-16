import { readFileSync } from 'node:fs'

const sample = readFileSync('sample.txt').toString('utf-8').trimEnd()
const real = readFileSync('real.txt').toString('utf-8').trimEnd()

console.log('sample answer A:', solveA(sample))
console.log('real answer A:', solveA(real))

console.log('sample answer B:', solveB(sample))
console.log('real answer B:', solveB(real))

function solveA(input: string) {
  const grid = input.split('\n').map((l) => l.split('').map((v) => Number(v)))

  return grid
    .map((r, y) =>
      r.map<number>((v, x) => {
        const topHidden = range(y)
          .map((i) => grid[y - i][x] >= v)
          .some((v) => v === true)
        const leftHidden = range(x)
          .map((i) => grid[y][x - i] >= v)
          .some((v) => v === true)
        const bottomHidden = range(grid.length - y - 1)
          .map((i) => grid[y + i][x] >= v)
          .some((v) => v === true)
        const rightHidden = range(r.length - x - 1)
          .map((i) => grid[y][x + i] >= v)
          .some((v) => v === true)
        const hidden = topHidden && leftHidden && bottomHidden && rightHidden
        return hidden ? 0 : 1
      }),
    )
    .flat()
    .reduce((a, b) => a + b, 0)
}

function solveB(input: string) {
  const grid = input.split('\n').map((l) => l.split('').map((v) => Number(v)))

  return grid
    .map((r, y) =>
      r.map<number>((v, x) => {
        const topSeen = range(y).find((i) => grid[y - i][x] >= v) || y
        const leftSeen = range(x).find((i) => grid[y][x - i] >= v) || x
        const bottomSeen = range(grid.length - y - 1).find((i) => grid[y + i][x] >= v) || grid.length - y - 1
        const rightSeen = range(r.length - x - 1).find((i) => grid[y][x + i] >= v) || r.length - x - 1
        return topSeen * leftSeen * bottomSeen * rightSeen
      }),
    )
    .flat()
    .sort((a, b) => b - a)[0]
}

function range(l: number) {
  return new Array(l).fill(0).map((_, i) => i + 1)
}
