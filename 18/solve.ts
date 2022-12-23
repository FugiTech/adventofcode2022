import { readFileSync } from 'node:fs'

const sample = readFileSync('sample.txt').toString('utf-8').trimEnd()
const real = readFileSync('real.txt').toString('utf-8').trimEnd()

const permutations = [
  [-1, 0, 0],
  [1, 0, 0],
  [0, -1, 0],
  [0, 1, 0],
  [0, 0, -1],
  [0, 0, 1],
] as const

console.log('sample answer A:', solveA(sample))
console.log('real answer A:', solveA(real))

console.log('sample answer B:', solveB(sample))
console.log('real answer B:', solveB(real))

function solveA(input: string) {
  const cubes = new Set(input.split('\n'))
  return Array.from(cubes)
    .map((l) => {
      const [x, y, z] = l.split(',').map((v) => Number(v)) as [number, number, number]
      return permutations.map<number>(([dx, dy, dz]) => {
        return cubes.has(`${x + dx},${y + dy},${z + dz}`) ? 0 : 1
      })
    })
    .flat()
    .reduce((a, b) => a + b, 0)
}

function solveB(input: string) {
  const air = new Set()
  const noAir = new Set(input.split('\n'))
  const cubes = Array.from(noAir).map((l) => l.split(',').map((v) => Number(v)) as [number, number, number])

  const canReachAir = (x: number, y: number, z: number, seen: Set<string>): boolean => {
    const k = `${x},${y},${z}`
    if (seen.has(k)) {
      return false
    }
    seen.add(k)
    if (air.has(k)) {
      // return true
    }
    if (x < 0 || x > 21 || y < 0 || y > 21 || z < 0 || z > 21) {
      return true
    }
    if (noAir.has(k)) {
      return false
    }
    return permutations.some(([dx, dy, dz]) => canReachAir(x + dx, y + dy, z + dz, seen))
  }

  for (let x = -1; x <= 22; x++) {
    for (let y = -1; y <= 22; y++) {
      for (let z = -1; z <= 22; z++) {
        const k = `${x},${y},${z}`
        const a = canReachAir(x, y, z, new Set())
        if (a) {
          air.add(k)
        } else {
          // noAir.add(k)
        }
      }
    }
  }

  return cubes
    .map(([x, y, z]) => {
      return permutations.map<number>(([dx, dy, dz]) => {
        return air.has(`${x + dx},${y + dy},${z + dz}`) ? 1 : 0
      })
    })
    .flat()
    .reduce((a, b) => a + b, 0)
}
