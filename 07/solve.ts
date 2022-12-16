import { readFileSync } from 'node:fs'

const sample = readFileSync('sample.txt').toString('utf-8').trimEnd()
const real = readFileSync('real.txt').toString('utf-8').trimEnd()

console.log('sample answer A:', solveA(sample))
console.log('real answer A:', solveA(real))

console.log('sample answer B:', solveB(sample))
console.log('real answer B:', solveB(real))

type Entry = number | Map<string, Entry>

function solveA(input: string) {
  const root = new Map<string, Entry>()
  let curr: Entry[] = []

  input.split('\n').forEach((l) => {
    const p = l.split(' ')
    if (p[0] === '$') {
      if (p[1] === 'ls') return
      switch (p[2]) {
        case '/':
          curr = [root]
          break
        case '..':
          curr.pop()
          break
        default:
          const k = p[2]!
          const c = curr[curr.length - 1]
          if (!c || typeof c === 'number') throw new Error(`invalid type for directory ${p[2]}`)
          if (!c.has(k)) c.set(k, new Map<string, Entry>())
          curr.push(c.get(k)!)
          break
      }
    } else {
      const c = curr[curr.length - 1]
      if (!c || typeof c === 'number') throw new Error(`invalid type for directory ${p[2]}`)
      const [size, name] = p
      if (size === 'dir') {
        c.set(name!, new Map<string, Entry>())
      } else {
        c.set(name!, Number(size))
      }
    }
  })

  let totalSize = 0
  const walk = (r: Map<string, Entry>) => {
    let size = 0
    for (const v of r.values()) {
      size += typeof v === 'number' ? v : walk(v)
    }
    if (size <= 100000) {
      totalSize += size
    }
    return size
  }
  walk(root)

  return totalSize
}

function solveB(input: string) {
  const root = new Map<string, Entry>()
  let curr: Entry[] = []

  input.split('\n').forEach((l) => {
    const p = l.split(' ')
    if (p[0] === '$') {
      if (p[1] === 'ls') return
      switch (p[2]) {
        case '/':
          curr = [root]
          break
        case '..':
          curr.pop()
          break
        default:
          const k = p[2]!
          const c = curr[curr.length - 1]
          if (!c || typeof c === 'number') throw new Error(`invalid type for directory ${p[2]}`)
          if (!c.has(k)) c.set(k, new Map<string, Entry>())
          curr.push(c.get(k)!)
          break
      }
    } else {
      const c = curr[curr.length - 1]
      if (!c || typeof c === 'number') throw new Error(`invalid type for directory ${p[2]}`)
      const [size, name] = p
      if (size === 'dir') {
        c.set(name!, new Map<string, Entry>())
      } else {
        c.set(name!, Number(size))
      }
    }
  })

  const sizes: number[] = []
  const walk = (r: Map<string, Entry>) => {
    let size = 0
    for (const v of r.values()) {
      size += typeof v === 'number' ? v : walk(v)
    }
    sizes.push(size)
    return size
  }
  const rootSize = walk(root)
  const threshold = 30000000 - (70000000 - rootSize)

  return sizes.sort((a, b) => a - b).find((v) => v >= threshold)
}
