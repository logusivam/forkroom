function transpilePythonToJS(pyCode: string): string {
  const lines = pyCode.split('\n')
  const jsLines: string[] = []
  const indentStack: number[] = []

  for (let line of lines) {
    const trimmed = line.trim()
    if (!trimmed) {
      jsLines.push('')
      continue
    }

    // Measure indentation
    const indent = line.length - line.trimStart().length

    // If indent is less than or equal to top block's indent, close those blocks
    while (indentStack.length > 0 && indent <= indentStack[indentStack.length - 1]) {
      indentStack.pop()
      jsLines.push('}'.padStart(indentStack.length + 1))
    }

    let jsLine = trimmed

    // Translate: def foo(bar): -> function foo(bar) {
    if (trimmed.startsWith('def ')) {
      const match = trimmed.match(/^def\s+(\w+)\s*\(([^)]*)\)\s*:/)
      if (match) {
        jsLine = `function ${match[1]}(${match[2]}) {`
        indentStack.push(indent)
      }
    }
    // Translate: print(...) -> console.log(...)
    else if (trimmed.startsWith('print(')) {
      jsLine = jsLine.replace(/^print\s*\(/, 'console.log(')
    }
    // Translate: print ... (without parenthesis) -> console.log(...)
    else if (trimmed.startsWith('print ')) {
      jsLine = `console.log(${trimmed.substring(6)})`
    }
    // Translate python f-strings: f"Hello {name}" -> `Hello ${name}`
    jsLine = jsLine.replace(/f"([^"]*)"/g, (_, g) => {
      const replaced = g.replace(/\{([^}]+)\}/g, '${$1}')
      return '`' + replaced + '`'
    })
    jsLine = jsLine.replace(/f'([^']*)'/g, (_, g) => {
      const replaced = g.replace(/\{([^}]+)\}/g, '${$1}')
      return '`' + replaced + '`'
    })

    // Translate split() to split(/\s+/)
    jsLine = jsLine.replace(/\.split\s*\(\s*\)/g, ".split(/\\s+/)")

    // Translate python keyword arguments like key=len to len
    jsLine = jsLine.replace(/\bkey\s*=\s*/g, '')

    // If line ends with colon and isn't def, handle if/for/while
    if (trimmed.endsWith(':') && !trimmed.startsWith('def ')) {
      const match = trimmed.match(/^(if|for|while|elif|else)\b(.*):$/)
      if (match) {
        const keyword = match[1] === 'elif' ? 'else if' : match[1]
        const cond = match[2].trim()
        if (keyword === 'for') {
          const forMatch = cond.match(/^(\w+)\s+in\s+(.*)$/)
          if (forMatch) {
            jsLine = `for (var ${forMatch[1]} of ${forMatch[2]}) {`
          } else {
            jsLine = `for (${cond}) {`
          }
        } else if (keyword === 'else') {
          jsLine = `else {`
        } else {
          jsLine = `${keyword} (${cond}) {`
        }
        indentStack.push(indent)
      }
    }
    // Translate variable assignment: x = value -> var x = value (to support strict mode)
    else {
      const assignMatch = jsLine.match(/^([a-zA-Z_]\w*)\s*=\s*(.*)$/)
      if (assignMatch) {
        jsLine = `var ${assignMatch[1]} = ${assignMatch[2]}`
      }
    }

    jsLines.push(' '.repeat(indent) + jsLine)
  }

  // Close any remaining blocks
  while (indentStack.length > 0) {
    indentStack.pop()
    jsLines.push('}')
  }

  const helpers = `
function len(x) {
  if (x === null || x === undefined) return 0;
  if (typeof x.length === 'number') return x.length;
  if (typeof x.size === 'number') return x.size;
  if (typeof x === 'object') return Object.keys(x).length;
  return 0;
}
function max(iterable, key) {
  if (!iterable || iterable.length === 0) return null;
  let maxVal = iterable[0];
  let maxKeyVal = key ? key(maxVal) : maxVal;
  for (let i = 1; i < iterable.length; i++) {
    let item = iterable[i];
    let itemKeyVal = key ? key(item) : item;
    if (itemKeyVal > maxKeyVal) {
      maxVal = item;
      maxKeyVal = itemKeyVal;
    }
  }
  return maxVal;
}
function min(iterable, key) {
  if (!iterable || iterable.length === 0) return null;
  let minVal = iterable[0];
  let minKeyVal = key ? key(minVal) : minVal;
  for (let i = 1; i < iterable.length; i++) {
    let item = iterable[i];
    let itemKeyVal = key ? key(item) : item;
    if (itemKeyVal < minKeyVal) {
      minVal = item;
      minKeyVal = itemKeyVal;
    }
  }
  return minVal;
}
function sum(iterable) {
  return iterable.reduce((a, b) => a + b, 0);
}
`

  return helpers + '\n' + jsLines.join('\n')
}

export function runCode(code: string, language: string = 'javascript'): string {
  const logs: string[] = []
  const originalLog = console.log
  const originalWarn = console.warn
  const originalError = console.error

  console.log = (...args: unknown[]) => logs.push(args.map(String).join(' '))
  console.warn = (...args: unknown[]) => logs.push('[warn] ' + args.map(String).join(' '))
  console.error = (...args: unknown[]) => logs.push('[error] ' + args.map(String).join(' '))

  const lang = language.toLowerCase()

  try {
    if (lang === 'javascript' || lang === 'typescript') {
      let codeToRun = code
      if (lang === 'typescript') {
        // Strip TypeScript annotations generically to run in JS sandbox
        codeToRun = code
          .replace(/interface\s+\w+\s*\{[\s\S]*?\}/g, '')
          .replace(/type\s+\w+\s*=\s*[\s\S]*?;/g, '')
          .replace(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(:\s*[A-Z_a-z]\w*(?:\[\])?)/g, (match, stringLiteral, typeAnnotation) => {
            if (stringLiteral) {
              return stringLiteral
            }
            const word = typeAnnotation.substring(1).trim()
            const jsKeywords = ['return', 'break', 'continue', 'case', 'default', 'throw', 'if', 'else', 'for', 'while', 'do', 'switch']
            if (jsKeywords.includes(word)) {
              return match
            }
            return ''
          })
          .replace(/<\w+>/g, '')
      }
      // eslint-disable-next-line no-eval
      const result = eval(codeToRun)
      if (result !== undefined && logs.length === 0) {
        logs.push(String(result))
      }
    } else if (lang === 'html') {
      // Find and evaluate javascript code within script tags in HTML
      const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi
      let match
      let scriptExecuted = false
      while ((match = scriptRegex.exec(code)) !== null) {
        const jsCode = match[1]
        // eslint-disable-next-line no-eval
        eval(jsCode)
        scriptExecuted = true
      }
      const textOnly = code.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
      logs.push(`[HTML Render Success]`)
      if (textOnly) {
        logs.push(`Text Content: "${textOnly}"`)
      }
      if (scriptExecuted) {
        logs.push(`Executed script tags successfully.`)
      }
    } else if (lang === 'css') {
      const openCount = (code.match(/\{/g) || []).length
      const closeCount = (code.match(/\}/g) || []).length
      if (openCount === closeCount) {
        logs.push(`[CSS Applied Successfully]`)
        logs.push(`Parsed ${openCount} styling rule blocks.`)
      } else {
        logs.push(`[CSS Warning] Bracket mismatch: { is ${openCount}, } is ${closeCount}`)
      }
    } else if (lang === 'json') {
      const parsed = JSON.parse(code)
      logs.push(`[JSON Valid] Parsed successfully:`)
      logs.push(JSON.stringify(parsed, null, 2))
    } else if (lang === 'python') {
      const jsCode = transpilePythonToJS(code)
      // eslint-disable-next-line no-eval
      const result = eval(jsCode)
      if (result !== undefined && logs.length === 0) {
        logs.push(String(result))
      }
    } else {
      logs.push(`Language ${language} parsed. Execution logs unavailable.`)
    }
  } catch (err) {
    logs.push(`Error: ${(err as Error).message}`)
  } finally {
    console.log = originalLog
    console.warn = originalWarn
    console.error = originalError
  }

  return logs.length > 0 ? logs.join('\n') : '(no output)'
}
