import { readFileSync } from 'node:fs'

const sample = readFileSync('sample.txt').toString('utf-8').trimEnd()
const real = readFileSync('real.txt').toString('utf-8').trimEnd()
/*
console.log('sample answer A:', solveA(sample))
console.log('real answer A:', solveA(real))

console.log('sample answer B:', solveB(sample))
console.log('real answer B:', solveB(real))
*/

console.log('real answer C:', solveC(real))

type Monkey = {
  items: number[]
  operation: (worry: number) => number
  test: (worry: number) => number
  inspected: number
}
function solveA(input: string) {
  const monkeys: Monkey[] = []
  input.split('\n\n').map((chunk) => {
    const lines = chunk.split('\n')
    const items = lines[1]!
      .split(': ')[1]!
      .split(', ')
      .map((i) => Number(i))
    const op = lines[2]!.split(' = ')[1]!
    const div = Number(lines[3]!.split(' ').pop())
    const monkeyT = Number(lines[4]!.split(' ').pop())
    const monkeyF = Number(lines[5]!.split(' ').pop())
    monkeys.push({
      items,
      operation: new Function('old', `return ${op}`) as (worry: number) => number,
      test: (worry: number) => (worry % div === 0 ? monkeyT : monkeyF),
      inspected: 0,
    })
  })

  for (let round = 0; round < 20; round++) {
    monkeys.forEach((m) => {
      m.items.forEach((worry) => {
        worry = m.operation(worry)
        worry = Math.floor(worry / 3)
        const idx = m.test(worry)
        monkeys[idx]!.items.push(worry)
        m.inspected++
      })
      m.items = []
    })
  }

  monkeys.sort((a, b) => b.inspected - a.inspected)
  return monkeys[0]!.inspected * monkeys[1]!.inspected
}

function solveB(input: string) {
  let totalDiv = 1
  const monkeys: Monkey[] = []
  input.split('\n\n').map((chunk) => {
    const lines = chunk.split('\n')
    const items = lines[1]!
      .split(': ')[1]!
      .split(', ')
      .map((i) => Number(i))
    const op = lines[2]!.split(' = ')[1]!
    const div = Number(lines[3]!.split(' ').pop())
    const monkeyT = Number(lines[4]!.split(' ').pop())
    const monkeyF = Number(lines[5]!.split(' ').pop())
    monkeys.push({
      items,
      operation: new Function('old', `return ${op}`) as (worry: number) => number,
      test: (worry: number) => (worry % div === 0 ? monkeyT : monkeyF),
      inspected: 0,
    })
    totalDiv *= div
  })

  for (let round = 0; round < 10000; round++) {
    monkeys.forEach((m) => {
      m.items.forEach((worry) => {
        worry = m.operation(worry)
        worry = worry % totalDiv
        const idx = m.test(worry)
        monkeys[idx]!.items.push(worry)
        m.inspected++
      })
      m.items = []
    })
  }

  console.log(monkeys.map((m) => m.inspected))
  monkeys.sort((a, b) => b.inspected - a.inspected)
  return monkeys[0]!.inspected * monkeys[1]!.inspected
}

type MonkeyFast = {
  inspected: number
  operation: (worry: number) => number
  div: number
  monkeyT: number
  monkeyF: number
}
function solveC(input: string) {
  let totalDiv = 1
  const monkeys: MonkeyFast[] = []
  const items: [number, number][] = []
  input.split('\n\n').map((chunk) => {
    const lines = chunk.split('\n')
    const _items = lines[1]!
      .split(': ')[1]!
      .split(', ')
      .map((i) => Number(i))
    for (const i of _items) {
      items.push([monkeys.length, i])
    }

    const op = lines[2]!.split(' ')
    const O = Number(op[op.length - 1])
    const operation =
      op[op.length - 1] === 'old'
        ? op[op.length - 2] === '+'
          ? (w: number) => w + w
          : (w: number) => w * w
        : op[op.length - 2] === '+'
        ? (w: number) => w + O
        : (w: number) => w * O

    const div = Number(lines[3]!.split(' ').pop())
    const monkeyT = Number(lines[4]!.split(' ').pop())
    const monkeyF = Number(lines[5]!.split(' ').pop())
    monkeys.push({
      inspected: 0,
      operation,
      div,
      monkeyT,
      monkeyF,
    })
    totalDiv *= div
  })

  for (let [mIdx, worry] of items) {
    for (let r1 = 0; r1 < 10000; r1++) {
      const m = monkeys[mIdx]!
      m.inspected++
      worry = m.operation(worry)
      worry = worry % totalDiv
      const newIdx = worry % m.div === 0 ? m.monkeyT : m.monkeyF
      if (newIdx > mIdx) r1--
      mIdx = newIdx
    }
  }

  monkeys.sort((a, b) => b.inspected - a.inspected)
  return monkeys[0]!.inspected * monkeys[1]!.inspected
}
