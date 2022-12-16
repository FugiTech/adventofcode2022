import { readFileSync } from 'node:fs'

const sample = readFileSync('sample.txt').toString('utf-8').trimEnd()
const real = readFileSync('real.txt').toString('utf-8').trimEnd()

console.log('sample answer A:', solveA(sample))
console.log('real answer A:', solveA(real))

console.log('sample answer B:', solveB(sample))
console.log('real answer B:', solveB(real))

type Cursor = {
  x: number
  y: number
  moves: number
}

function solveA(input: string) {
  const S = { x: 0, y: 0 }
  const E = { x: 0, y: 0 }
  const grid = input.split('\n').map((l, y) => {
    return l.split('').map((c, x) => {
      if (c === 'S') {
        S.x = x
        S.y = y
        return 0
      }
      if (c === 'E') {
        E.x = x
        E.y = y
        return 25
      }
      return 'abcdefghijklmnopqrstuvwxyz'.indexOf(c)
    })
  })

  const visited = new Set<string>()
  const moves = priorityQueue<Cursor>()
  moves.insert({ ...S, moves: 0 }, 0)
  visited.add(`${S.x}-${S.y}`)

  while (moves.size() > 0) {
    const m = moves.pop()
    // console.log(m.x, m.y, m.moves, `(${moves.size()})`)
    if (m.x === E.x && m.y === E.y) {
      return m.moves
    }
    for (const [dx, dy] of [
      [-1, 0],
      [0, -1],
      [1, 0],
      [0, 1],
    ]) {
      const [x, y] = [m.x + dx!, m.y + dy!]
      if (!visited.has(`${x}-${y}`) && y >= 0 && y < grid.length && x >= 0 && x < grid[y]!.length && grid[m.y]![m.x]! + 1 >= grid[y]![x]!) {
        moves.insert({ x, y, moves: m.moves + 1 }, m.moves + 1)
        visited.add(`${x}-${y}`)
      }
    }
  }
}

function solveB(input: string) {
  const E = { x: 0, y: 0 }
  const grid = input.split('\n').map((l, y) => {
    return l.split('').map((c, x) => {
      if (c === 'S') {
        return 0
      }
      if (c === 'E') {
        E.x = x
        E.y = y
        return 25
      }
      return 'abcdefghijklmnopqrstuvwxyz'.indexOf(c)
    })
  })

  const visited = new Set<string>()
  const moves = priorityQueue<Cursor>()
  moves.insert({ ...E, moves: 0 }, 0)
  visited.add(`${E.x}-${E.y}`)

  while (moves.size() > 0) {
    const m = moves.pop()
    // console.log(m.x, m.y, m.moves, `(${moves.size()})`)
    if (grid[m.y]![m.x]! === 0) {
      return m.moves
    }
    for (const [dx, dy] of [
      [-1, 0],
      [0, -1],
      [1, 0],
      [0, 1],
    ]) {
      const [x, y] = [m.x + dx!, m.y + dy!]
      if (!visited.has(`${x}-${y}`) && y >= 0 && y < grid.length && x >= 0 && x < grid[y]!.length && grid[m.y]![m.x]! - 1 <= grid[y]![x]!) {
        moves.insert({ x, y, moves: m.moves + 1 }, m.moves + 1)
        visited.add(`${x}-${y}`)
      }
    }
  }
}

interface Node<T> {
  key: number
  value: T
}

interface PriorityQueue<T> {
  insert(item: T, priority: number): void
  pop(): T
  size(): number
}

function priorityQueue<T>(): PriorityQueue<T> {
  let heap: Node<T>[] = []

  const parent = (index: number) => Math.floor((index - 1) / 2)
  const left = (index: number) => 2 * index + 1
  const right = (index: number) => 2 * index + 2
  const hasLeft = (index: number) => left(index) < heap.length
  const hasRight = (index: number) => right(index) < heap.length

  const swap = (a: number, b: number) => {
    const tmp = heap[a]!
    heap[a] = heap[b]!
    heap[b] = tmp
  }

  return {
    size: () => heap.length,

    insert: (item, prio) => {
      heap.push({ key: prio, value: item })

      let i = heap.length - 1
      while (i > 0) {
        const p = parent(i)
        if (heap[p]!.key < heap[i]!.key) break
        const tmp = heap[i]!
        heap[i] = heap[p]!
        heap[p] = tmp
        i = p
      }
    },

    pop: () => {
      if (heap.length == 0) throw new Error('heap empty')

      swap(0, heap.length - 1)
      const item = heap.pop()!

      let current = 0
      while (hasLeft(current)) {
        let smallerChild = left(current)
        if (hasRight(current) && heap[right(current)]!.key < heap[left(current)]!.key) smallerChild = right(current)

        if (heap[smallerChild]!.key > heap[current]!.key) break

        swap(current, smallerChild)
        current = smallerChild
      }

      return item.value
    },
  }
}
