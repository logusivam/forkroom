import { describe, it, expect } from 'vitest'
import { runCode } from './evalSandbox'

describe('evalSandbox', () => {
  it('should run basic arithmetic and return value', () => {
    expect(runCode('2 + 3')).toBe('5')
  })

  it('should capture console.log output', () => {
    expect(runCode('console.log("hello"); 10')).toBe('hello')
  })

  it('should capture warn/error tags', () => {
    expect(runCode('console.warn("warning"); console.error("error")')).toBe(
      '[warn] warning\n[error] error'
    )
  })

  it('should handle runtime errors', () => {
    expect(runCode('nonExistentVar')).toContain('Error:')
  })

  it('should handle empty outputs', () => {
    expect(runCode('')).toBe('(no output)')
  })

  it('should transpile and execute TypeScript code with interfaces', () => {
    const code = `
      interface User {
        id: number;
        name: string;
      }
      const user: User = {
        id: 1,
        name: "Bob"
      };
      console.log(\`User \${user.id}: \${user.name}\`);
    `
    expect(runCode(code, 'typescript')).toContain('User 1: Bob')
  })

  it('should transpile and execute TypeScript code containing switch statements and type keywords', () => {
    const code = `
      type ResponseStatus = "success" | "error" | "pending";
      function handleResponse(status: ResponseStatus): string {
        switch (status) {
          case "success": return "✓ Data loaded successfully.";
          case "error": return "✗ Error: Connection failed.";
          case "pending": return "⏳ Loading, please wait...";
        }
      }
      const currentStatus: ResponseStatus = "error";
      console.log(handleResponse(currentStatus));
    `
    expect(runCode(code, 'typescript')).toBe('✗ Error: Connection failed.')
  })

  it('should parse HTML and execute script tags', () => {
    const code = '<h1>Title</h1><script>console.log("hello HTML")</script>'
    expect(runCode(code, 'html')).toContain('hello HTML')
  })

  it('should parse and format valid JSON', () => {
    const code = '{"a": 1}'
    expect(runCode(code, 'json')).toContain('[JSON Valid]')
  })

  it('should execute complex Python function definitions and string formatting', () => {
    const code = `
def greet(name):
    return f"Hello, {name}!"

user_name = "Alice"
print(greet(user_name))
    `
    expect(runCode(code, 'python')).toBe('Hello, Alice!')
  })

  it('should execute Python loop iteration with conditionals', () => {
    const code = `
numbers = [2, 7, 4, 9, 5, 8]
for num in numbers:
    if num > 5:
        print(f"Match found: {num}")
    `
    expect(runCode(code, 'python')).toBe('Match found: 7\nMatch found: 9\nMatch found: 8')
  })
})
