import { readFileSync } from 'node:fs'

const sample = readFileSync('sample.txt').toString('utf-8').trimEnd()
const real = readFileSync('real.txt').toString('utf-8').trimEnd()

console.log('sample answer A:', solveA(sample))
console.log('real answer A:', solveA(real))

console.log('sample answer B:', solveB(sample))
console.log('real answer B:', solveB(real))

function solveA(input: string) {
  let cycles = [1]
  input.split('\n').map((l) => {
    const x = cycles[cycles.length - 1]!
    const p = l.split(' ')
    switch (p[0]) {
      case 'noop':
        cycles.push(x)
        break
      case 'addx':
        cycles.push(x, x + Number(p[1]))
        break
    }
  })
  const signal = (c: number) => c * cycles[c - 1]!
  return [20, 60, 100, 140, 180, 220].map((c) => signal(c)).reduce((a, b) => a + b, 0)
}

function solveB(input: string) {
  const out: string[] = []

  let x = 1
  let cycles = 0
  input.split('\n').map((l) => {
    const render = () => {
      out.push([x - 1, x, x + 1].includes(cycles % 40) ? '#' : '.')
      cycles++
    }

    const p = l.split(' ')
    switch (p[0]) {
      case 'noop':
        render()
        break
      case 'addx':
        render()
        render()
        x += Number(p[1])
        break
    }
  })
  return [0, 40, 80, 120, 160, 200].map((v) => '\n' + out.slice(v, v + 40).join('')).join('')
}
