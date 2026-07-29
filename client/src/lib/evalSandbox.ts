export function runCode(code: string): string {
  const logs: string[] = []
  const originalLog = console.log
  const originalWarn = console.warn
  const originalError = console.error

  console.log = (...args: unknown[]) => logs.push(args.map(String).join(' '))
  console.warn = (...args: unknown[]) => logs.push('[warn] ' + args.map(String).join(' '))
  console.error = (...args: unknown[]) => logs.push('[error] ' + args.map(String).join(' '))

  try {
    // eslint-disable-next-line no-eval
    const result = eval(code)
    if (result !== undefined && logs.length === 0) {
      logs.push(String(result))
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
