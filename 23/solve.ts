import { readFileSync } from 'node:fs'

const sample = readFileSync('sample.txt').toString('utf-8').trimEnd()
const real = readFileSync('real.txt').toString('utf-8').trimEnd()

type Elf = {
  x: number
  y: number
  proposed: [number, number] | undefined
}
console.log('sample answer A:', solveA(sample))
console.log('real answer A:', solveA(real))

console.log('sample answer B:', solveB(sample))
console.log('real answer B:', solveB(real))

function solveA(input: string) {
  const elves = input
    .split('\n')
    .map((l, y) => {
      return Array.from(l).map((c, x) => {
        return c === '#' ? { x, y } : undefined
      })
    })
    .flat()
    .filter((v) => v) as Elf[]
  const moves = [
    {
      test: [
        [-1, -1],
        [0, -1],
        [1, -1],
      ],
      move: [0, -1],
    },
    {
      test: [
        [-1, 1],
        [0, 1],
        [1, 1],
      ],
      move: [0, 1],
    },
    {
      test: [
        [-1, -1],
        [-1, 0],
        [-1, 1],
      ],
      move: [-1, 0],
    },
    {
      test: [
        [1, -1],
        [1, 0],
        [1, 1],
      ],
      move: [1, 0],
    },
  ] as { test: [number, number][]; move: [number, number] }[]
  const noMoveTest = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
  ] as const
  const key = (x: number, y: number) => y * 10000 + x
  const print = () => {
    const places = new Set(elves.map((e) => key(e.x, e.y)))
    console.log(
      new Array(12)
        .fill(0)
        .map((_, y) => {
          return new Array(14)
            .fill(0)
            .map((_, x) => {
              return places.has(key(x, y)) ? '#' : '.'
            })
            .join('')
        })
        .join('\n') + '\n',
    )
  }

  // print()
  for (let R = 0; R < 10; R++) {
    const places = new Set(elves.map((e) => key(e.x, e.y)))
    const proposed = new Map<number, number>()
    // Part 1
    for (const e of elves) {
      const noMove = noMoveTest.every(([dx, dy]) => !places.has(key(e.x + dx, e.y + dy)))
      if (noMove) {
        continue
      }
      for (let midx = 0; midx < 4; midx++) {
        const m = moves[(R + midx) % moves.length]!
        if (m.test.every(([dx, dy]) => !places.has(key(e.x + dx, e.y + dy)))) {
          e.proposed = [e.x + m.move[0], e.y + m.move[1]]
          const c = proposed.get(key(e.proposed[0], e.proposed[1])) || 0
          proposed.set(key(e.proposed[0], e.proposed[1]), c + 1)
          break
        }
      }
    }
    // Part 2
    for (const e of elves) {
      if (e.proposed) {
        const c = proposed.get(key(e.proposed[0], e.proposed[1])) || 0
        if (c === 1) {
          e.x = e.proposed[0]
          e.y = e.proposed[1]
        }
        e.proposed = undefined
      }
    }
    // print()
  }

  const minX = elves.reduce((v, e) => (e.x < v ? e.x : v), 999999)
  const minY = elves.reduce((v, e) => (e.y < v ? e.y : v), 999999)
  const maxX = elves.reduce((v, e) => (e.x > v ? e.x : v), 0)
  const maxY = elves.reduce((v, e) => (e.y > v ? e.y : v), 0)
  const size = (1 + maxX - minX) * (1 + maxY - minY)

  return size - elves.length
}

function solveB(input: string) {
  const elves = input
    .split('\n')
    .map((l, y) => {
      return Array.from(l).map((c, x) => {
        return c === '#' ? { x, y } : undefined
      })
    })
    .flat()
    .filter((v) => v) as Elf[]
  const moves = [
    {
      test: [
        [-1, -1],
        [0, -1],
        [1, -1],
      ],
      move: [0, -1],
    },
    {
      test: [
        [-1, 1],
        [0, 1],
        [1, 1],
      ],
      move: [0, 1],
    },
    {
      test: [
        [-1, -1],
        [-1, 0],
        [-1, 1],
      ],
      move: [-1, 0],
    },
    {
      test: [
        [1, -1],
        [1, 0],
        [1, 1],
      ],
      move: [1, 0],
    },
  ] as { test: [number, number][]; move: [number, number] }[]
  const noMoveTest = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
  ] as const
  const key = (x: number, y: number) => y * 10000 + x
  const print = () => {
    const places = new Set(elves.map((e) => key(e.x, e.y)))
    console.log(
      new Array(12)
        .fill(0)
        .map((_, y) => {
          return new Array(14)
            .fill(0)
            .map((_, x) => {
              return places.has(key(x, y)) ? '#' : '.'
            })
            .join('')
        })
        .join('\n') + '\n',
    )
  }

  // print()
  let R = 0
  let moved = 1
  for (; moved; R++) {
    moved = 0
    const places = new Set(elves.map((e) => key(e.x, e.y)))
    const proposed = new Map<number, number>()
    // Part 1
    for (const e of elves) {
      const noMove = noMoveTest.every(([dx, dy]) => !places.has(key(e.x + dx, e.y + dy)))
      if (noMove) {
        continue
      }
      for (let midx = 0; midx < 4; midx++) {
        const m = moves[(R + midx) % moves.length]!
        if (m.test.every(([dx, dy]) => !places.has(key(e.x + dx, e.y + dy)))) {
          e.proposed = [e.x + m.move[0], e.y + m.move[1]]
          const c = proposed.get(key(e.proposed[0], e.proposed[1])) || 0
          proposed.set(key(e.proposed[0], e.proposed[1]), c + 1)
          break
        }
      }
    }
    // Part 2
    for (const e of elves) {
      if (e.proposed) {
        const c = proposed.get(key(e.proposed[0], e.proposed[1])) || 0
        if (c === 1) {
          e.x = e.proposed[0]
          e.y = e.proposed[1]
          moved++
        }
        e.proposed = undefined
      }
    }
    // print()
  }

  return R
}
