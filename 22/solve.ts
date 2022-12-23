import { readFileSync } from 'node:fs'

const sample = readFileSync('sample.txt').toString('utf-8').trimEnd()
const real = readFileSync('real.txt').toString('utf-8').trimEnd()

console.log('sample answer A:', solveA(sample))
console.log('real answer A:', solveA(real))

console.log('sample answer B:', solveB(sample, true))
console.log('real answer B:', solveB(real, false))

function solveA(input: string) {
  const movements = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ] as const

  const p = input.split('\n\n')
  const map = p[0]!.split('\n')
  const directions = p[1]!.matchAll(/\d+|L|R/g)

  let dir: 0 | 1 | 2 | 3 = 0
  let pos = [map[0]!.indexOf('.'), 0] as [number, number]

  const walk = (x: number, y: number): boolean => {
    let [nx, ny] = [x + movements[dir][0], y + movements[dir][1]] as const
    if (nx < 0) {
      nx = map[0]!.length - 1
    }
    if (nx >= map[0]!.length) {
      nx = 0
    }
    if (ny < 0) {
      ny = map.length - 1
    }
    if (ny >= map.length) {
      ny = 0
    }
    if (map[ny]![nx]! === ' ' || map[ny]![nx]! === undefined) {
      return walk(nx, ny)
    }
    if (map[ny]![nx]! === '#') {
      return false
    }
    pos = [nx, ny]
    return true
  }

  let R = 0
  for (const d of directions) {
    if (d[0] === 'L' || d[0] === 'R') {
      const turn = d[0] === 'R' ? 1 : -1
      dir = ((4 + dir + turn) % 4) as 0 | 1 | 2 | 3
    } else {
      const amt = Number(d[0])
      for (let i = 0; i < amt; i++) {
        if (!walk(pos[0], pos[1])) {
          break
        }
      }
    }
    // console.log(pos, dir, d)
    // if (R++ > 3) break
  }

  return 1000 * (pos[1] + 1) + 4 * (pos[0] + 1) + dir
}

function solveB(input: string, sample: boolean) {
  enum Move {
    Right,
    Down,
    Left,
    Up,
  }
  const movements = [
    [1, 0], // RIGHT
    [0, 1], // DOWN
    [-1, 0], // LEFT
    [0, -1], // UP
  ] as const

  const p = input.split('\n\n')
  const map = p[0]!.split('\n')
  const directions = p[1]!.matchAll(/\d+|L|R/g)

  let dir: Move = Move.Right
  let pos = [map[0]!.indexOf('.'), 0] as [number, number]

  const teleports = new Map<string, [number, number, Move]>()
  if (sample) {
    for (let y = 0; y < 4; y++) {
      let x = 4 + y
      teleports.set(`7:${y}:${Move.Left}`, [x, 4, 1])
      teleports.set(`${x}:3:${Move.Up}`, [8, y, 0])
    }
    for (let x = 8; x < 12; x++) {
      let xx = 11 - x
      teleports.set(`${x}:-1:${Move.Up}`, [xx, 4, 1])
      teleports.set(`${xx}:3:${Move.Up}`, [x, 0, 1])
    }
    for (let y = 0; y < 4; y++) {
      let yy = 11 - y
      teleports.set(`12:${y}:${Move.Right}`, [15, yy, 2])
      teleports.set(`16:${yy}:${Move.Right}`, [11, y, 2])
    }
    for (let y = 4; y < 8; y++) {
      let x = 19 - y
      teleports.set(`12:${y}:${Move.Right}`, [x, 8, 0])
      teleports.set(`${x}:7:${Move.Up}`, [11, y, 1])
    }
    for (let x = 12; x < 16; x++) {
      let y = 19 - x
      teleports.set(`${x}:12:${Move.Down}`, [0, y, 0])
      teleports.set(`-1:${y}:${Move.Left}`, [x, 11, 3])
    }
    for (let x = 8; x < 12; x++) {
      let xx = 11 - x
      teleports.set(`${x}:12:${Move.Down}`, [xx, 7, 3])
      teleports.set(`${xx}:8:${Move.Down}`, [x, 11, 3])
    }
    for (let y = 8; y < 12; y++) {
      let x = 15 - y
      teleports.set(`7:${y}:${Move.Left}`, [x, 7, 3])
      teleports.set(`${x}:8:${Move.Down}`, [8, y, 0])
    }
  } else {
    for (let y = 50; y < 100; y++) {
      let x = y - 50
      teleports.set(`49:${y}:${Move.Left}`, [x, 100, Move.Down])
      teleports.set(`${x}:99:${Move.Up}`, [50, y, Move.Right])
    }
    for (let y = 0; y < 50; y++) {
      let yy = 149 - y
      teleports.set(`49:${y}:${Move.Left}`, [0, yy, Move.Right])
      teleports.set(`-1:${yy}:${Move.Left}`, [50, y, Move.Right])
    }
    for (let x = 50; x < 100; x++) {
      let y = 100 + x
      teleports.set(`${x}:-1:${Move.Up}`, [0, y, Move.Right])
      teleports.set(`-1:${y}:${Move.Left}`, [x, 0, Move.Down])
    }
    for (let x = 100; x < 150; x++) {
      let xx = x - 100
      teleports.set(`${x}:-1:${Move.Up}`, [xx, 199, Move.Up])
      teleports.set(`${xx}:200:${Move.Down}`, [x, 0, Move.Down])
    }
    for (let y = 0; y < 50; y++) {
      let yy = 149 - y
      teleports.set(`150:${y}:${Move.Right}`, [99, yy, Move.Left])
      teleports.set(`100:${yy}:${Move.Right}`, [149, y, Move.Left])
    }
    for (let y = 50; y < 100; y++) {
      let x = y + 50
      teleports.set(`100:${y}:${Move.Right}`, [x, 49, Move.Up])
      teleports.set(`${x}:50:${Move.Down}`, [99, y, Move.Left])
    }
    for (let y = 150; y < 200; y++) {
      let x = y - 100
      teleports.set(`50:${y}:${Move.Right}`, [x, 149, Move.Up])
      teleports.set(`${x}:150:${Move.Down}`, [49, y, Move.Left])
    }
  }

  const walk = (x: number, y: number, d: Move): boolean => {
    let [nx, ny] = [x + movements[d][0], y + movements[d][1]] as const
    if (teleports.has(`${nx}:${ny}:${d}`)) {
      const v = teleports.get(`${nx}:${ny}:${d}`)!
      nx = v[0]
      ny = v[1]
      d = v[2]
    }
    if (map[ny]![nx]! === '#') {
      return false
    }
    if (map[ny]![nx]! !== '.') {
      throw new Error('bad')
    }
    pos = [nx, ny]
    dir = d
    return true
  }

  let R = 0
  for (const d of directions) {
    if (d[0] === 'L' || d[0] === 'R') {
      const turn = d[0] === 'R' ? 1 : -1
      dir = (4 + dir + turn) % 4
    } else {
      const amt = Number(d[0])
      for (let i = 0; i < amt; i++) {
        if (!walk(pos[0], pos[1], dir)) {
          break
        }
      }
    }
    // console.log(pos, dir, d)
    // if (R++ > 3) break
  }
  console.log(pos, dir)
  return 1000 * (pos[1] + 1) + 4 * (pos[0] + 1) + dir
}
