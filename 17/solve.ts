import { readFileSync } from 'node:fs'

const sample = readFileSync('sample.txt').toString('utf-8').trimEnd()
const real = readFileSync('real.txt').toString('utf-8').trimEnd()

console.log('sample answer A:', solveA(sample))
console.log('real answer A:', solveA(real))

console.log('sample answer B:', solveB(sample))
console.log('real answer B:', solveB(real))

function solveA(input: string) {
  const map = new Array<[boolean, boolean, boolean, boolean, boolean, boolean, boolean]>()
  const grow = (h: number) => {
    while (map.length < h) {
      map.push([false, false, false, false, false, false, false])
    }
  }
  const height = () => {
    for (let h = map.length - 1; h >= 0; h--) {
      if (map[h]!.some((v) => v)) {
        return h + 1
      }
    }
    return 0
  }
  const print = () => {
    for (let h = map.length - 1; h >= 0; h--) {
      console.log(`|${map[h]!.map((v) => (v ? '#' : '.')).join('')}|`)
    }
    console.log('+-------+')
  }

  const rocks = [
    {
      w: 4,
      h: 1,
      pos: [
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
      ],
    },
    {
      w: 3,
      h: 3,
      pos: [
        [1, 0],
        [0, 1],
        [1, 1],
        [2, 1],
        [1, 2],
      ],
    },
    {
      w: 3,
      h: 3,
      pos: [
        [0, 0],
        [1, 0],
        [2, 0],
        [2, 1],
        [2, 2],
      ],
    },
    {
      w: 1,
      h: 4,
      pos: [
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
      ],
    },
    {
      w: 2,
      h: 2,
      pos: [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ],
    },
  ] as const

  let inputIdx = 0
  for (let R = 0; R < 2022; R++) {
    const curRock = {
      x: 2,
      y: height() + 3,
      ...rocks[R % rocks.length]!,
    }
    grow(curRock.y + curRock.h)

    while (true) {
      if (input[inputIdx++ % input.length] === '>') {
        // Blow right
        if (curRock.x + curRock.w < 7 && !curRock.pos.some(([x, y]) => map[curRock.y + y]![curRock.x + x + 1])) {
          curRock.x++
        }
      } else {
        // Blow left
        if (curRock.x > 0 && !curRock.pos.some(([x, y]) => map[curRock.y + y]![curRock.x + x - 1])) {
          curRock.x--
        }
      }
      // Come to rest
      if (curRock.y === 0 || curRock.pos.some(([x, y]) => map[curRock.y + y - 1]![curRock.x + x])) {
        break
      }
      // Fall down
      curRock.y--
    }
    for (const p of curRock.pos) {
      map[curRock.y + p[1]]![curRock.x + p[0]] = true
    }

    // print()
  }

  return height()
}

function solveB(input: string) {
  const map = new Array<[boolean, boolean, boolean, boolean, boolean, boolean, boolean]>()
  const grow = (h: number) => {
    while (map.length < h) {
      map.push([false, false, false, false, false, false, false])
    }
  }
  const height = () => {
    for (let h = map.length - 1; h >= 0; h--) {
      if (map[h]!.some((v) => v)) {
        return h + 1
      }
    }
    return 0
  }
  const print = () => {
    for (let h = map.length - 1; h >= 0; h--) {
      console.log(`|${map[h]!.map((v) => (v ? '#' : '.')).join('')}|`)
    }
    console.log('+-------+')
  }

  const rocks = [
    {
      w: 4,
      h: 1,
      pos: [
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
      ],
    },
    {
      w: 3,
      h: 3,
      pos: [
        [1, 0],
        [0, 1],
        [1, 1],
        [2, 1],
        [1, 2],
      ],
    },
    {
      w: 3,
      h: 3,
      pos: [
        [0, 0],
        [1, 0],
        [2, 0],
        [2, 1],
        [2, 2],
      ],
    },
    {
      w: 1,
      h: 4,
      pos: [
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
      ],
    },
    {
      w: 2,
      h: 2,
      pos: [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ],
    },
  ] as const

  // Run the game enough to find a pattern
  let inputIdx = 0
  const rockHistory = new Array(rocks.length * input.length).fill(0).map((_, R) => {
    const rockIdx = R % rocks.length
    const curRock = {
      rockIdx,
      x: 2,
      y: height() + 3,
      ...rocks[rockIdx]!,
    }
    grow(curRock.y + curRock.h)

    while (true) {
      if (input[inputIdx++ % input.length] === '>') {
        // Blow right
        if (curRock.x + curRock.w < 7 && !curRock.pos.some(([x, y]) => map[curRock.y + y]![curRock.x + x + 1])) {
          curRock.x++
        }
      } else {
        // Blow left
        if (curRock.x > 0 && !curRock.pos.some(([x, y]) => map[curRock.y + y]![curRock.x + x - 1])) {
          curRock.x--
        }
      }
      // Come to rest
      if (curRock.y === 0 || curRock.pos.some(([x, y]) => map[curRock.y + y - 1]![curRock.x + x])) {
        break
      }
      // Fall down
      curRock.y--
    }
    for (const p of curRock.pos) {
      map[curRock.y + p[1]]![curRock.x + p[0]] = true
    }
    return curRock
  })

  // Determine how many rocks are in the pattern
  let period = -1
  const fixedRock = rockHistory[rockHistory.length - 1]!
  for (let I = rockHistory.length - 2; I >= 0; I--) {
    const r = rockHistory[I]!
    if (r.rockIdx === fixedRock.rockIdx && r.x === fixedRock.x) {
      const P = rockHistory.length - I - 1
      const A = rockHistory[rockHistory.length - 1]!
      const B = rockHistory[rockHistory.length - 1 - P]!
      const same = new Array(P).fill(0).every((_, J) => {
        const a = rockHistory[rockHistory.length - 1 - J]!
        const b = rockHistory[rockHistory.length - 1 - J - P]!
        return a.rockIdx === b.rockIdx && a.x === b.x && A.y - a.y === B.y - b.y
      })
      if (same) {
        period = P
        break
      }
    }
  }
  const periodHeight = fixedRock.y - rockHistory[rockHistory.length - 1 - period]!.y

  // Now determine how many are in the "prefix" before the patterns tarts
  let prefix = -1
  for (let I = rockHistory.length - period - 1; I >= 0; I--) {
    const a = rockHistory[I + period]!
    const b = rockHistory[I]!
    if (a.x !== b.x || a.y !== b.y + periodHeight) {
      prefix = I + 1
      break
    }
  }

  const cycle1height = rockHistory[prefix + period]!.y
  const cycles = Math.floor((1000000000000 - prefix) / period)
  const remaining = 1000000000000 - prefix - cycles * period
  const remainingHeight = rockHistory[prefix + period + remaining]!.y - cycle1height

  return cycle1height + (cycles - 1) * periodHeight + remainingHeight
}
