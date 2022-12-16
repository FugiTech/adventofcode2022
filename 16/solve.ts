import { readFileSync } from 'node:fs'

const sample = readFileSync('sample.txt').toString('utf-8').trimEnd()
const real = readFileSync('real.txt').toString('utf-8').trimEnd()

console.log('sample answer A:', solveA(sample))
console.log('real answer A:', solveA(real))

console.log('sample answer B:', solveB3(sample))
console.log('real answer B:', solveB3(real))

function solveA(input: string) {
  const valves = new Map(
    input.split('\n').map((l) => {
      const [currValve, flowRate, tunnels] = /Valve ([A-Z]+) has flow rate=(\d+); tunnels? leads? to valves? ([A-Z, ]+)/.exec(l)?.slice(1) as [string, string, string]
      return [
        currValve,
        {
          id: currValve,
          flow: Number(flowRate),
          tunnels: tunnels.split(', '),
        },
      ]
    }),
  )
  const moves = [{ loc: 'AA', time: 30, pressureReleased: 0, opened: new Set(), log: new Array<string>() }]
  const seen = new Set<string>()
  const finals = []
  while (moves.length > 0) {
    const m = moves.shift()!
    const v = valves.get(m.loc)!
    if (m.time < 0) {
      continue
    }
    if (m.time === 0) {
      finals.push(m)
      continue
    }
    if (seen.has(`${m.loc}-${m.pressureReleased}-${JSON.stringify(m.opened.values())}`)) {
      continue
    }
    seen.add(`${m.loc}-${m.pressureReleased}-${JSON.stringify(m.opened.values())}`)
    // If we don't open the valve
    for (const loc of v.tunnels) {
      moves.push({
        loc,
        time: m.time - 1,
        pressureReleased: m.pressureReleased,
        opened: m.opened,
        log: [...m.log, `move ${loc}`],
      })
    }
    // If we open the valve
    if (!m.opened.has(v.id)) {
      const opened = new Set([v.id, ...m.opened.values()])
      const pressureReleased = m.pressureReleased + v.flow * (m.time - 1)
      for (const loc of v.tunnels) {
        moves.push({
          loc,
          time: m.time - 2,
          pressureReleased,
          opened,
          log: [...m.log, `open ${v.id}`, `move ${loc}`],
        })
      }
      // We can also choose to just stop moving
      //if (m.time >= 1) {
      //  finals.push(pressureReleased)
      //}
    }
    // console.log(moves.length)
  }
  finals.sort((a, b) => b.pressureReleased - a.pressureReleased)
  return finals[0]
}

function solveB(input: string) {
  const valves = new Map(
    input.split('\n').map((l) => {
      const [currValve, flowRate, tunnels] = /Valve ([A-Z]+) has flow rate=(\d+); tunnels? leads? to valves? ([A-Z, ]+)/.exec(l)?.slice(1) as [string, string, string]
      return [
        currValve,
        {
          id: currValve,
          flow: Number(flowRate),
          tunnels: tunnels.split(', '),
        },
      ]
    }),
  )
  const moves = priorityQueue([
    {
      myLoc: 'AA',
      eleLoc: 'AA',
      myTime: 26,
      eleTime: 26,
      pressureReleased: 0,
      opened: new Set(),
      myOpened: new Set(),
      eleOpened: new Set(),
      myLog: new Array<string>(),
      eleLog: new Array<string>(),
      myBacktrack: new Set(['AA']),
      eleBacktrack: new Set(['AA']),
      priority: 0,
    },
  ])
  const seen = new Set<string>()
  const finals = []
  while (moves.size() > 0 && finals.length < 4000) {
    console.log(moves.size(), finals.length)
    const m = moves.pop()!
    const vm = valves.get(m.myLoc)!
    const ve = valves.get(m.eleLoc)!
    if (m.myTime < 0 || m.eleTime < 0) {
      console.log(m)
      continue
    }
    if (m.myTime === 0 && m.eleTime === 0) {
      // console.log(m)
      finals.push(m)
      continue
    }
    const seenKey = `${m.myLoc}-${m.eleLoc}-${m.pressureReleased}-${JSON.stringify(Array.from(m.opened.values()).sort())}`
    if (seen.has(seenKey)) {
      continue
    }
    seen.add(seenKey)

    const myOptions = vm.tunnels.map((myLoc) => ({
      myLoc,
      myTime: m.myTime - 1,
      myLog: [...m.myLog, `move ${myLoc}`],
      pressureReleased: 0,
      opened: new Array<string>(),
    }))
    if (!m.opened.has(vm.id) && vm.flow > 0) {
      const pressureReleased = vm.flow * (m.myTime - 1)
      myOptions.push({
        myLoc: m.myLoc,
        myTime: m.myTime - 1,
        myLog: [...m.myLog, `open ${vm.id}`],
        pressureReleased,
        opened: [vm.id],
      })
    }
    myOptions.push({
      myLoc: m.myLoc,
      myTime: m.myTime - 1,
      myLog: [...m.myLog, `stay ${vm.id}`],
      pressureReleased: 0,
      opened: new Array<string>(),
    })

    const eleOptions = ve.tunnels.map((eleLoc) => ({
      eleLoc,
      eleTime: m.eleTime - 1,
      eleLog: [...m.eleLog, `move ${eleLoc}`],
      pressureReleased: 0,
      opened: new Array<string>(),
    }))
    if (!m.opened.has(ve.id) && ve.flow > 0) {
      const pressureReleased = ve.flow * (m.eleTime - 1)
      eleOptions.push({
        eleLoc: m.eleLoc,
        eleTime: m.eleTime - 1,
        eleLog: [...m.eleLog, `open ${ve.id}`],
        pressureReleased,
        opened: [ve.id],
      })
    }
    eleOptions.push({
      eleLoc: m.eleLoc,
      eleTime: m.eleTime - 1,
      eleLog: [...m.eleLog, `stay ${ve.id}`],
      pressureReleased: 0,
      opened: new Array<string>(),
    })

    for (const me of myOptions) {
      for (const ele of eleOptions) {
        // Can't both open the same thing at the same time
        if (me.opened.length && me.opened[0] === ele.opened[0]) {
          continue
        }
        if (me.myLoc !== m.myLoc && m.myBacktrack.has(me.myLoc)) {
          continue
        }
        if (ele.eleLoc !== m.eleLoc && m.eleBacktrack.has(ele.eleLoc)) {
          continue
        }
        const myBacktrack = me.opened.length ? new Set([me.myLoc]) : new Set([...m.myBacktrack.values(), me.myLoc])
        const eleBacktrack = ele.opened.length ? new Set([ele.eleLoc]) : new Set([...m.eleBacktrack.values(), ele.eleLoc])

        const pressureReleased = m.pressureReleased + me.pressureReleased + ele.pressureReleased
        const priority =
          m.priority -
          10000 * (me.opened.length + ele.opened.length) * me.myTime +
          (me.myLog[me.myLog.length - 1]?.startsWith('stay') ? 30000 : 0) * me.myTime +
          (ele.eleLog[ele.eleLog.length - 1]?.startsWith('stay') ? 30000 : 0) * me.myTime
        moves.insert(
          {
            ...me,
            ...ele,
            pressureReleased,
            opened: new Set([...m.opened.values(), ...me.opened, ...ele.opened]),
            myOpened: new Set([...m.myOpened.values(), ...me.opened]),
            eleOpened: new Set([...m.eleOpened.values(), ...ele.opened]),
            myBacktrack,
            eleBacktrack,
            priority,
          },
          priority,
        )
      }
    }
  }
  finals.sort((a, b) => b.pressureReleased - a.pressureReleased)
  return finals[0]
}

function solveB2(input: string) {
  const valves = new Map(
    input.split('\n').map((l) => {
      const [currValve, flowRate, tunnels] = /Valve ([A-Z]+) has flow rate=(\d+); tunnels? leads? to valves? ([A-Z, ]+)/.exec(l)?.slice(1) as [string, string, string]
      return [
        currValve,
        {
          id: currValve,
          flow: Number(flowRate),
          tunnels: tunnels.split(', '),
          paths: new Map<string, number>(),
        },
      ]
    }),
  )
  type Valve = NonNullable<ReturnType<typeof valves.get>>

  for (const v of valves.values()) {
    v.paths.set(v.id, 0)
    const queue = []
    const helper = (vv: Valve, d: number) => {
      for (const t of vv.tunnels) {
        if (v.paths.has(t)) {
          continue
        }
        v.paths.set(t, d)
        queue.push(() => helper(valves.get(t)!, d + 1))
      }
    }
    queue.push(() => helper(v, 1))
    while (queue.length > 0) {
      queue.shift()!()
    }
  }

  const importantValves = Array.from(valves.entries())
    .filter(([k, v]) => v.flow > 0)
    .map(([k, v]) => k)

  const moves = priorityQueue([
    {
      myLoc: 'AA',
      eleLoc: 'AA',
      myTime: 26,
      eleTime: 26,
      pressureReleased: 0,
      opened: new Set(),
    },
  ])
  // const finished = []
  let highScore = 0

  while (moves.size() > 0) {
    //    console.log(moves.size())
    //  console.log(finished.length)
    const m = moves.pop()
    // What if I open valve
    for (const v of importantValves) {
      if (m.opened.has(v)) {
        continue
      }
      const V = valves.get(v)!
      const time = m.myTime - 1 - V.paths.get(m.myLoc)!
      if (time < 0) {
        continue
      }
      const nm = {
        myLoc: v,
        myTime: time,
        eleLoc: m.eleLoc,
        eleTime: m.eleTime,
        pressureReleased: m.pressureReleased + V.flow * time,
        opened: new Set([...m.opened.values(), v]),
      }
      moves.insert(nm, nm.myTime + nm.eleTime)
      if (nm.pressureReleased > highScore) {
        highScore = nm.pressureReleased
      }
      // finished.push(nm) // Act like we just stop here
    }
    // What if elephant opens valve
    for (const v of importantValves) {
      if (m.opened.has(v)) {
        continue
      }
      const V = valves.get(v)!
      const time = m.eleTime - 1 - V.paths.get(m.eleLoc)!
      if (time < 0) {
        continue
      }
      const nm = {
        eleLoc: v,
        eleTime: time,
        myLoc: m.myLoc,
        myTime: m.myTime,
        pressureReleased: m.pressureReleased + V.flow * time,
        opened: new Set([...m.opened.values(), v]),
      }
      moves.insert(nm, nm.myTime + nm.eleTime)
      if (nm.pressureReleased > highScore) {
        highScore = nm.pressureReleased
      }
      // finished.push(nm) // Act like we just stop here
    }
  }

  return highScore
  //  finished.sort((a, b) => b.pressureReleased - a.pressureReleased)
  //  return finished[0]
}

function solveB3(input: string) {
  const valves = new Map(
    input.split('\n').map((l) => {
      const [currValve, flowRate, tunnels] = /Valve ([A-Z]+) has flow rate=(\d+); tunnels? leads? to valves? ([A-Z, ]+)/.exec(l)?.slice(1) as [string, string, string]
      return [
        currValve,
        {
          id: currValve,
          flow: Number(flowRate),
          tunnels: tunnels.split(', '),
          paths: new Map<string, number>(),
        },
      ]
    }),
  )
  type Valve = NonNullable<ReturnType<typeof valves.get>>

  for (const v of valves.values()) {
    v.paths.set(v.id, 0)
    const queue = []
    const helper = (vv: Valve, d: number) => {
      for (const t of vv.tunnels) {
        if (v.paths.has(t)) {
          continue
        }
        v.paths.set(t, d)
        queue.push(() => helper(valves.get(t)!, d + 1))
      }
    }
    queue.push(() => helper(v, 1))
    while (queue.length > 0) {
      queue.shift()!()
    }
  }

  const importantValves = Array.from(valves.entries())
    .filter(([k, v]) => v.flow > 0)
    .map(([k, v]) => k)

  let moves = [
    {
      loc: 'AA',
      time: 26,
      pressureReleased: 0,
      opened: new Set<string>(),
    },
  ]
  type Move = typeof moves[0]
  const possible: Move[] = []

  for (let R = 1; moves.length > 0; R++) {
    // Perform each round independently
    const round: Move[] = []
    for (const m of moves) {
      // Try opening each remaining valve
      for (const v of importantValves) {
        if (m.opened.has(v)) {
          continue
        }
        const V = valves.get(v)!
        const time = m.time - 1 - V.paths.get(m.loc)!
        if (time < 0) {
          continue
        }
        round.push({
          loc: v,
          time,
          pressureReleased: m.pressureReleased + V.flow * time,
          opened: new Set([...m.opened.values(), v]),
        })
      }
    }
    // Now that we have all 15x moves, try to crunch down the possibilities
    // If loc and opened are the same, only leave the one with the higher pressureReleased
    const dedup = new Map<string, Move[]>()
    for (const m of round) {
      const k = `${m.loc}-${Array.from(m.opened.values()).sort().join('.')}`
      const v = dedup.get(k) || []
      v.push(m)
      dedup.set(k, v)
    }
    const remaining = Array.from(dedup.values()).map((g) => {
      return g.sort((a, b) => b.pressureReleased - a.pressureReleased)[0]!
    })
    // console.log(`Round ${R}: ${moves.length} -> ${round.length} -> ${remaining.length}`)
    possible.push(...remaining)
    moves = remaining
  }

  // Now we need to find the combination of two that gives the highest answer
  const overlap = <T>(a: Set<T>, b: Set<T>) => {
    for (const e of a) {
      if (b.has(e)) {
        return true
      }
    }
    return false
  }
  const final = possible
    .map((M) => {
      return possible.filter((E) => !overlap(M.opened, E.opened)).map((E) => M.pressureReleased + E.pressureReleased)
    })
    .flat()

  final.sort((a, b) => b - a)
  return final[0]
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
