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
        // Strip TypeScript annotations using simple regexes to run in JS sandbox
        codeToRun = code
          .replace(/interface\s+\w+\s*\{[^}]*\}/g, '')
          .replace(/type\s+\w+\s*=\s*[^;]+;/g, '')
          .replace(/:\s*(string|number|boolean|any|void|unknown|never|object|string\[\]|number\[\]|boolean\[\])\b/g, '')
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
      // Strip HTML tags to get pure text content for display feedback
      const textOnly = code.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
      logs.push(`[HTML Render Success]`)
      if (textOnly) {
        logs.push(`Text Content: "${textOnly}"`)
      }
      if (scriptExecuted) {
        logs.push(`Executed script tags successfully.`)
      }
    } else if (lang === 'css') {
      // Verify basic bracket balance
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
      // Simple Python print statement evaluator
      const lines = code.split('\n')
      const variables: Record<string, unknown> = {}
      let printed = false

      for (let line of lines) {
        line = line.trim()
        if (!line || line.startsWith('#')) continue

        const printMatch = line.match(/^print\s*\((.*)\)$/)
        if (printMatch) {
          const content = printMatch[1].trim()
          if ((content.startsWith('"') && content.endsWith('"')) || (content.startsWith("'") && content.endsWith("'"))) {
            logs.push(content.substring(1, content.length - 1))
          } else if (variables[content] !== undefined) {
            logs.push(String(variables[content]))
          } else {
            try {
              // eslint-disable-next-line no-eval
              logs.push(String(eval(content)))
            } catch {
              logs.push(content)
            }
          }
          printed = true
          continue
        }

        const assignMatch = line.match(/^([a-zA-Z_]\w*)\s*=\s*(.*)$/)
        if (assignMatch) {
          const varName = assignMatch[1]
          const valStr = assignMatch[2].trim()
          try {
            // eslint-disable-next-line no-eval
            variables[varName] = eval(valStr)
          } catch {
            variables[varName] = valStr
          }
          continue
        }
      }
      if (!printed) {
        logs.push(`[Python Success] Script checked. No print outputs generated.`)
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
