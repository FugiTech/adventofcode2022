import { readFileSync } from 'node:fs'

const sample = readFileSync('sample.txt').toString('utf-8').trimEnd()
const real = readFileSync('real.txt').toString('utf-8').trimEnd()

console.log('sample answer A:', solveA(sample))
console.log('real answer A:', solveA(real))

console.log('sample answer B:', solveB2(sample))
console.log('real answer B:', solveB2(real))

function solveA(input: string) {
  const monkeys = new Map<string, () => number>()
  input.split('\n').forEach((l) => {
    const p = l.split(' ')
    const m = p[0]!.slice(0, -1) // Strip colon
    if (p.length === 4) {
      const a = p[1]!
      const b = p[3]!
      monkeys.set(m, new Function('monkeys', `return monkeys.get('${a}')(monkeys) ${p[2]!} monkeys.get('${b}')(monkeys)`) as () => number)
    } else {
      const v = Number(p[1])
      monkeys.set(m, () => v)
    }
  })
  return monkeys.get('root')!(monkeys)
}

function solveB(input: string) {
  const monkeys = new Map<string, number | readonly [string | number, string, string | number]>()
  input.split('\n').forEach((l) => {
    const p = l.split(' ')
    const m = p[0]!.slice(0, -1) // Strip colon
    if (p.length === 4) {
      const a = p[1]!
      const o = m === 'root' ? '===' : p[2]!
      const b = p[3]!
      monkeys.set(m, [a, o, b] as const)
    } else {
      const v = Number(p[1])
      monkeys.set(m, v)
    }
  })
  monkeys.delete('humn')
  let changed = 1
  while (changed > 0) {
    changed = 0
    for (const [k, v] of monkeys.entries()) {
      if (typeof v !== 'number') {
        let [a, o, b] = v
        let A = typeof a === 'number' ? a : monkeys.get(a)
        let B = typeof b === 'number' ? b : monkeys.get(b)
        if (typeof A === 'number' && typeof B === 'number') {
          const vv = eval(`${A} ${o} ${B}`) as number
          monkeys.set(k, vv)
          changed++
        } else if (typeof A === 'number' && typeof a !== 'number') {
          monkeys.set(k, [A, o, b])
          changed++
        } else if (typeof B === 'number' && typeof b !== 'number') {
          monkeys.set(k, [a, o, B])
          changed++
        }
      }
    }
  }

  /*
  // console.log(monkeys)
  const walk = (k: string): string => {
    if (k === 'humn') {
      return 'H'
    }
    const v = monkeys.get(k)!
    if (typeof v === 'number') {
      return `${v}`
    }
    let s = ''
    if (typeof v[0] === 'number') {
      s += `${v[0]}`
    } else {
      s += walk(v[0])
    }
    s += ` ${v[1]} `
    if (typeof v[2] === 'number') {
      s += `${v[2]}`
    } else {
      s += walk(v[2])
    }
    return `(${s})`
  }
  console.log(walk('root'))
  */

  let [L, _, R] = monkeys.get('root') as [string, string, number] | [number, string, string]
  if (typeof L === 'number') {
    const t = R
    R = L
    L = t
  }
  while (L !== 'humn') {
    const [a, o, b] = monkeys.get(L as string) as [string, string, number] | [number, string, string]
    if (typeof a === 'string') {
      L = a
      switch (o) {
        case '+':
          R -= b
          break
        case '-':
          R += b
          break
        case '*':
          R /= b
          break
        case '/':
          R *= b
          break
      }
    } else {
      L = b
      switch (o) {
        case '+':
          R -= a
          break
        case '-':
          R = a - R
          break
        case '*':
          R /= a
          break
        case '/':
          R = a / R
          break
      }
    }
  }

  return R
}

function solveB2(input: string) {
  const monkeys = new Map<string, () => number>()
  input.split('\n').forEach((l) => {
    const p = l.split(' ')
    const m = p[0]!.slice(0, -1) // Strip colon
    if (p.length === 4) {
      const a = p[1]!
      const o = m === 'root' ? '-' : p[2]!
      const b = p[3]!
      const fn = '' // m === 'root' ? 'Math.abs' : ''
      monkeys.set(m, new Function('monkeys', `return ${fn}(monkeys.get('${a}')(monkeys) ${o} monkeys.get('${b}')(monkeys))`) as () => number)
    } else {
      const v = Number(p[1])
      monkeys.set(m, () => v)
    }
  })

  const MaxNum = 100_000_000_000_000
  let humn = MaxNum
  for (let R = 1; R < 30; R++) {
    monkeys.set('humn', () => humn)
    const v = monkeys.get('root')!(monkeys)
    const d = Math.ceil(MaxNum / Math.pow(2, R))
    console.log(humn, v, d)
    if (v === 0) {
      return humn
    }
    if (v < 0) {
      humn += d
    } else {
      humn -= d
    }
  }
  // 3_429_411_069_028
  return undefined
}
