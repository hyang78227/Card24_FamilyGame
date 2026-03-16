const TARGET = 24
const EPS = 1e-9
const OPS = ['+', '-', '*', '/']

function applyOp(a, b, op) {
  if (op === '+') return a + b
  if (op === '-') return a - b
  if (op === '*') return a * b
  if (op === '/') return Math.abs(b) < EPS ? null : a / b
  return null
}

function needsParens(expr) {
  // Returns true if expr is a compound expression (contains an operator)
  let depth = 0
  for (let i = 1; i < expr.length - 1; i++) {
    if (expr[i] === '(') depth++
    else if (expr[i] === ')') depth--
    else if (depth === 0 && (expr[i] === '+' || expr[i] === '-' || expr[i] === '*' || expr[i] === '/')) {
      return true
    }
  }
  return false
}

function formatExpr(a, b, op, exprA, exprB) {
  const leftNeedsParens = (op === '*' || op === '/') && needsParens(exprA)
  const rightNeedsParens =
    (op === '*' || op === '/') && needsParens(exprB) ||
    op === '-' && needsParens(exprB) ||
    op === '/' && needsParens(exprB)

  const left = leftNeedsParens ? `(${exprA})` : exprA
  const right = rightNeedsParens ? `(${exprB})` : exprB
  return `${left} ${op} ${right}`
}

function solve(nums, exprs) {
  if (nums.length === 1) {
    return Math.abs(nums[0] - TARGET) < EPS ? exprs[0] : null
  }

  for (let i = 0; i < nums.length; i++) {
    for (let j = 0; j < nums.length; j++) {
      if (i === j) continue
      const restNums = nums.filter((_, k) => k !== i && k !== j)
      const restExprs = exprs.filter((_, k) => k !== i && k !== j)

      for (const op of OPS) {
        const val = applyOp(nums[i], nums[j], op)
        if (val === null) continue

        const expr = formatExpr(nums[i], nums[j], op, exprs[i], exprs[j])
        const result = solve([val, ...restNums], [expr, ...restExprs])
        if (result !== null) return result
      }
    }
  }
  return null
}

/**
 * Returns true if the card values have at least one valid 24 solution.
 * @param {number[]} values - array of 4 card values
 */
export function hasSolution(values) {
  return solve(values, values.map(String)) !== null
}

/**
 * Returns a formatted solution string, or null if none exists.
 * @param {number[]} values - array of 4 card values
 */
export function getSolution(values) {
  return solve(values, values.map(String))
}
