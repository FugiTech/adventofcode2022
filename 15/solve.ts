import { readFileSync } from 'node:fs'

const sample = readFileSync('sample.txt').toString('utf-8').trimEnd()
const real = readFileSync('real.txt').toString('utf-8').trimEnd()

console.log('sample answer A:', solveA(sample, 10))
console.log('real answer A:', solveA(real, 2000000))

//console.log('sample answer B:', solveB3(sample, 20))
//console.log('real answer B:', solveB3(real, 4000000))

function solveA(input: string, y: number) {
  const visit = new Set<number>()
  const withBeacon = new Set<number>()
  input.split('\n').map((l) => {
    const [sx, sy, bx, by] = /Sensor at x=([-\d]+), y=([-\d]+): closest beacon is at x=([-\d]+), y=([-\d]+)/
      .exec(l)
      ?.slice(1)
      .map((v) => Number(v)) as [number, number, number, number]
    const d = Math.abs(bx - sx) + Math.abs(by - sy)
    const dy = Math.abs(y - sy)
    for (let i = 0; i < d - dy + 1; i++) {
      visit.add(sx + i)
      visit.add(sx - i)
    }
    if (by === y) {
      withBeacon.add(bx)
    }
  })
  return visit.size - withBeacon.size
}

function solveB(input: string, maxCoord: number) {
  const tests = input.split('\n').map((l) => {
    const [sx, sy, bx, by] = /Sensor at x=([-\d]+), y=([-\d]+): closest beacon is at x=([-\d]+), y=([-\d]+)/
      .exec(l)
      ?.slice(1)
      .map((v) => Number(v)) as [number, number, number, number]
    const d = Math.abs(bx - sx) + Math.abs(by - sy)
    return (x: number, y: number) => Math.abs(x - sx) + Math.abs(y - sy) <= d
  })
  for (let x = 0; x <= maxCoord; x++) {
    for (let y = 0; y <= maxCoord; y++) {
      if (!tests.some((fn) => fn(x, y))) {
        return x * 4000000 + y
      }
    }
  }
  return -1
}

function solveB2(input: string, maxCoord: number) {
  const tests = input.split('\n').map((l) => {
    const [sx, sy, bx, by] = /Sensor at x=([-\d]+), y=([-\d]+): closest beacon is at x=([-\d]+), y=([-\d]+)/
      .exec(l)
      ?.slice(1)
      .map((v) => Number(v)) as [number, number, number, number]
    const d = Math.abs(bx - sx) + Math.abs(by - sy)
    return [sx, sy, d]
  })
  let [x, y] = [maxCoord / 2, maxCoord / 2]
  const visited = new Set<string>()
  BigLoop: while (0 <= x && x <= maxCoord && 0 <= y && y <= maxCoord) {
    visited.add(`${x}-${y}`)
    console.log(x, y)
    const ds = tests.map(([sx, sy, d], idx) => {
      const dd = Math.abs(x - sx!) + Math.abs(y - sy!)
      return dd <= d! ? [idx, dd] : [idx, maxCoord]
    })
    ds.sort((a, b) => a[1]! - b[1]!)
    const [sx, sy, d] = tests[ds[0]![0]!]! as [number, number, number]
    if (d === maxCoord) {
      return x * 4000000 + y
    }
    const deg = (Math.atan2(x - sx, y - sy) * 180) / Math.PI
    for (const offset of [0, -45, 45, -90, 90]) {
      const [nx, ny] = deg2pt(x, y, deg + offset)
      if (!visited.has(`${nx}-${ny}`)) {
        x = nx!
        y = ny!
        continue BigLoop
      }
    }
    return -2
  }
  return -1
}

function deg2pt(x: number, y: number, deg: number) {
  if (-22.5 <= deg && deg <= 22.5) {
    x++
  } else if (22.5 <= deg && deg <= 67.5) {
    x++
    y++
  } else if (67.5 <= deg && deg <= 112.5) {
    y++
  } else if (112.5 <= deg && deg <= 157.5) {
    x--
    y++
  } else if (157.5 <= deg || deg <= -157.5) {
    x--
  } else if (-157.5 <= deg && deg <= -112.5) {
    x--
    y--
  } else if (-112.5 <= deg && deg <= -67.5) {
    y--
  } else if (-67.5 <= deg && deg <= -22.5) {
    x++
    y--
  }
  return [x, y]
}

function solveB3(input: string, maxCoord: number) {
  const sensors = input.split('\n').map((l) => {
    const [sx, sy, bx, by] = /Sensor at x=([-\d]+), y=([-\d]+): closest beacon is at x=([-\d]+), y=([-\d]+)/
      .exec(l)
      ?.slice(1)
      .map((v) => Number(v)) as [number, number, number, number]
    const d = Math.abs(bx - sx) + Math.abs(by - sy)
    return [sx, sy, d] as const
  })

  for (const [sx, sy, d] of sensors) {
    for (let x = sx - d - 1; x <= sx + d + 1; x++) {
      const ys = [sy + d + 1 - Math.abs(x - sx), sy - d - 1 + Math.abs(x - sx)]
      for (let y of ys) {
        if (0 <= x && x <= maxCoord && 0 <= y && y <= maxCoord && !sensors.some(([ssx, ssy, sd]) => Math.abs(x - ssx) + Math.abs(y - ssy) <= sd)) {
          return x * 4000000 + y
        }
      }
    }
  }
  return -1
}
