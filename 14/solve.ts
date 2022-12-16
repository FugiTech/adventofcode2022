import { readFileSync } from 'node:fs'

const sample = readFileSync('sample.txt').toString('utf-8').trimEnd()
const real = readFileSync('real.txt').toString('utf-8').trimEnd()

console.log('sample answer A:', solveA(sample))
console.log('real answer A:', solveA(real))

console.log('sample answer B:', solveB(sample))
console.log('real answer B:', solveB(real))

function printGrid(grid: number[][]) {
  console.log(grid.slice(0, 13).map(r => {
    return r.slice(490, 505).map(v => v === 2 ? 'o' : v === 1 ? '#' : '.').join('')
  }).join('\n'))
}

function solveA(input: string) {
  const grid = new Array(1000).fill(0).map(r => new Array(1000).fill(0)) as number[][]
  input.split('\n').map(l => {
    const p = l.split(' -> ').map(g => g.split(',').map(v => Number(v)))
    for(let i = 1; i < p.length; i++) {
      const [[sx, sy], [ex, ey]] = [p[i-1]!, p[i]!]
      if (sx === ex) {
        const [s,e] = [Math.min(sy!, ey!), Math.max(sy!, ey!)]
        for(let y = s; y <= e; y++) {
          grid[y]![sx!] = 1
        }
      } else {
        const [s,e] = [Math.min(sx!, ex!), Math.max(sx!, ex!)]
        for(let x = s; x <= e; x++) {
          grid[sy!]![x] = 1
        }
      }
    }
  })

  let placed = 0
  for(; placed < 1000000; placed++) {
    const point = { x: 500, y: 0}
    for(; point.y < grid.length - 1; ) {
      if (!grid[point.y+1]![point.x]) {
        point.y++
      } else if (!grid[point.y+1]![point.x-1]) {
        point.y++
        point.x--
      } else if (!grid[point.y+1]![point.x+1]) {
        point.y++
        point.x++
      } else {
        break
      }
    }
    if (point.y === grid.length - 1) {
      break
    }
    grid[point.y]![point.x] = 2
  }
  return placed
}

function solveB(input: string) {
  const grid = new Array(1000).fill(0).map(r => new Array(1000).fill(0)) as number[][]
  input.split('\n').map(l => {
    const p = l.split(' -> ').map(g => g.split(',').map(v => Number(v)))
    for(let i = 1; i < p.length; i++) {
      const [[sx, sy], [ex, ey]] = [p[i-1]!, p[i]!]
      if (sx === ex) {
        const [s,e] = [Math.min(sy!, ey!), Math.max(sy!, ey!)]
        for(let y = s; y <= e; y++) {
          grid[y]![sx!] = 1
        }
      } else {
        const [s,e] = [Math.min(sx!, ex!), Math.max(sx!, ex!)]
        for(let x = s; x <= e; x++) {
          grid[sy!]![x] = 1
        }
      }
    }
  })
  for(let y = grid.length - 1; y >= 0; y--) {
    const rock = grid[y]!.some(v => !!v)
    if (rock) {
      grid[y+2] = new Array(1000).fill(1)
      break
    }
  }
  printGrid(grid)

  let placed = 0
  for(; placed < 1000000; placed++) {
    const point = { x: 500, y: 0}
    for(; point.y < grid.length - 1; ) {
      if (!grid[point.y+1]![point.x]) {
        point.y++
      } else if (!grid[point.y+1]![point.x-1]) {
        point.y++
        point.x--
      } else if (!grid[point.y+1]![point.x+1]) {
        point.y++
        point.x++
      } else {
        break
      }
    }
    if (point.y === grid.length - 1 || (point.x == 500 && point.y === 0 && grid[point.y]![point.x])) {
      break
    }
    grid[point.y]![point.x] = 2
  }
  return placed
}
