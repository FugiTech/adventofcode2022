import { readFileSync } from 'node:fs'

const sample = readFileSync('sample.txt').toString('utf-8').trimEnd()
const real = readFileSync('real.txt').toString('utf-8').trimEnd()

// console.log('sample answer A:', solveA(sample))
// console.log('real answer A:', solveA(real))

console.log('sample answer B:', solveB2(sample))
console.log('real answer B:', solveB2(real))

type S = [number, number, number, number]

function solveA(input: string) {
  const robots = input.split('\n').map((l, robotIdx) => {
    const [oo, co, Oo, Oc, go, gO] =
      /Blueprint \d+: Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./
        .exec(l)!
        .slice(1)
        .map((v) => Number(v))
    // Ore, Clay, Obsidian, Geode
    const costs = [
      [oo!, 0, 0, 0],
      [co!, 0, 0, 0],
      [Oo!, Oc!, 0, 0],
      [go!, 0, gO!, 0],
    ] as const

    const moves = [
      {
        supplies: [0, 0, 0, 0] as S,
        robots: [1, 0, 0, 0] as S,
        minutes: 24,
        choice: undefined as 0 | 1 | 2 | 3 | undefined,
      },
    ]
    const seen = new Set<string>()
    let recovered = 0

    while (moves.length > 0) {
      const { supplies, robots, minutes, choice } = moves.shift()!
      const key = `${supplies.join('.')}-${robots.join('.')}-${minutes}-${choice}`
      if (seen.has(key)) {
        continue
      }
      seen.add(key)
      //if (moves.length % 10000 === 0) {
      // console.log(robotIdx, minutes, moves.length, supplies, robots, choice)
      //}
      if (minutes === 0) {
        if (supplies[3] > recovered) recovered = supplies[3]
        continue
      }
      if (choice === undefined) {
        if (minutes < 5) {
          moves.push({
            supplies,
            robots,
            minutes,
            choice: 3,
          })
          continue
        }
        for (const c of [0, 1, 2, 3] as const) {
          // Skip things that are impossible
          if (robots[c] === 0 && !costs[c].every((v, i) => v <= supplies[i]! + robots[i]! * minutes)) {
            continue
          }
          moves.push({
            supplies,
            robots,
            minutes,
            choice: c,
          })
        }
        continue
      }

      let supp: S = [...supplies]
      const robs: S = [...robots]
      const canBuild = supp.every((v, idx) => v >= costs[choice][idx]!)
      if (canBuild) {
        // Pay to build the bot
        supp = supp.map((v, idx) => v - costs[choice][idx]!) as S
      }
      // Do the mining
      supp = supp.map((v, idx) => v + robs[idx]!) as S
      // Get the robot we built
      if (canBuild) {
        robs[choice]++
      }
      moves.push({
        supplies: supp,
        robots: robs,
        minutes: minutes - 1,
        choice: canBuild ? undefined : choice,
      })
    }

    return recovered
  })
  return robots.reduce((a, b, i) => a + b * (i + 1), 0)
}

function solveB(input: string) {
  const robots = input
    .split('\n')
    .slice(0, 3)
    .map((l, robotIdx) => {
      const [oo, co, Oo, Oc, go, gO] =
        /Blueprint \d+: Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./
          .exec(l)!
          .slice(1)
          .map((v) => Number(v))
      // Ore, Clay, Obsidian, Geode
      const costs = [
        [oo!, 0, 0, 0],
        [co!, 0, 0, 0],
        [Oo!, Oc!, 0, 0],
        [go!, 0, gO!, 0],
      ] as const

      const moves = priorityQueue([
        {
          supplies: [0, 0, 0, 0] as S,
          robots: [1, 0, 0, 0] as S,
          minutes: 32,
          choice: undefined as 0 | 1 | 2 | 3 | undefined,
        },
      ])
      //let seen = new Set<string>()
      //let seenMinute = 0
      let recovered = 0

      for (let rounds = 0; moves.size() > 0 && moves.size() < 7000000 && rounds < 10_000_000; rounds++) {
        const { supplies, robots, minutes, choice } = moves.pop()
        /*
        const key = `${supplies.join('.')}-${robots.join('.')}-${choice}`
        if (minutes !== seenMinute) {
          seenMinute = minutes
          seen = new Set()
        }
        if (seen.has(key)) {
          continue
        }
        seen.add(key)
        if (moves.size() % 10000 === 0) {
          console.log(robotIdx, minutes, moves.size(), supplies, robots, choice)
        }
        */
        if (minutes === 0) {
          if (supplies[3] > recovered) recovered = supplies[3]
          continue
        }
        if (choice === undefined) {
          if (minutes < 11) {
            moves.insert(
              {
                supplies,
                robots,
                minutes,
                choice: 3,
              },
              -1 * minutes + -10 * supplies[3] + -100 * robots[3],
            )
            continue
          }
          for (const c of [0, 1, 2, 3] as const) {
            // Skip things that are impossible
            if (robots[c] === 0 && !costs[c].every((v, i) => v <= supplies[i]! + robots[i]! * minutes)) {
              continue
            }
            moves.insert(
              {
                supplies,
                robots,
                minutes,
                choice: c,
              },
              -1 * minutes + -10 * supplies[3] + -100 * robots[3],
            )
          }
          continue
        }

        let supp: S = [...supplies]
        const robs: S = [...robots]
        const canBuild = supp.every((v, idx) => v >= costs[choice][idx]!)
        if (canBuild) {
          // Pay to build the bot
          supp = supp.map((v, idx) => v - costs[choice][idx]!) as S
        }
        // Do the mining
        supp = supp.map((v, idx) => v + robs[idx]!) as S
        // Get the robot we built
        if (canBuild) {
          robs[choice]++
        }
        moves.insert(
          {
            supplies: supp,
            robots: robs,
            minutes: minutes - 1,
            choice: canBuild ? undefined : choice,
          },
          -1 * (minutes - 1) + -10 * supp[3] + -100 * robots[3],
        )
      }
      console.log(recovered, moves.size())

      return recovered
    })
  return robots
}

function solveB2(input: string) {
  const robots = input
    .split('\n')
    .slice(0, 3)
    .map((l, robotIdx) => {
      const [oo, co, Oo, Oc, go, gO] =
        /Blueprint \d+: Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./
          .exec(l)!
          .slice(1)
          .map((v) => Number(v))
      // Ore, Clay, Obsidian, Geode
      const costs = [
        [oo!, 0, 0, 0],
        [co!, 0, 0, 0],
        [Oo!, Oc!, 0, 0],
        [go!, 0, gO!, 0],
      ] as const

      let moves = [
        {
          supplies: [0, 0, 0, 0] as S,
          robots: [1, 0, 0, 0] as S,
        },
      ]
      type Move = typeof moves[0]

      for (let minute = 1; minute <= 32; minute++) {
        // console.log(robotIdx, minute, moves.length)
        // Perform each round independently
        const round: Move[] = []
        for (const m of moves) {
          // Try to build each kind of robot
          for (const choice of [0, 1, 2, 3] as const) {
            let supplies: S = [...m.supplies]
            const robots: S = [...m.robots]
            const canBuild = supplies.every((v, idx) => v >= costs[choice][idx]!)
            if (!canBuild) {
              continue
            }
            // Pay to build the bot & do mining
            supplies = supplies.map((v, idx) => v - costs[choice][idx]! + robots[idx]!) as S
            // Get the robot we built
            robots[choice]++
            round.push({ supplies, robots })
          }
          // Also don't build anythin g and just stockpile
          round.push({
            supplies: m.supplies.map((v, idx) => v + m.robots[idx]!) as S,
            robots: m.robots,
          })
        }
        // Sort moves by how many robots and supplies we have and chop off the top 10k
        moves = round
          .sort(
            (a, b) =>
              b.robots[3] - a.robots[3] ||
              b.robots[2] - a.robots[2] ||
              b.robots[1] - a.robots[1] ||
              b.robots[0] - a.robots[0] ||
              b.supplies[3] - a.supplies[3] ||
              b.supplies[2] - a.supplies[2] ||
              b.supplies[1] - a.supplies[1] ||
              b.supplies[0] - a.supplies[0],
          )
          .slice(0, 100)
      }

      // Great we're done, find the max geodes mined
      return moves.reduce((v, m) => (m.supplies[3] > v ? m.supplies[3] : v), 0)
    })
  return robots.reduce((a, b) => a * b, 1)
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

function priorityQueue<T>(init: T[]): PriorityQueue<T> {
  let heap: Node<T>[] = init.map((value) => ({ key: 0, value }))

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
