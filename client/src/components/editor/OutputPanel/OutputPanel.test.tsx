import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { OutputPanel } from './OutputPanel'

describe('OutputPanel', () => {
  it('should render placeholder text if no output', () => {
    render(<OutputPanel output={null} onClear={vi.fn()} language="javascript" />)
    expect(screen.getByText(/No output/i)).toBeDefined()
  })

  it('should render output logs and trigger clear action', () => {
    const mockClear = vi.fn()
    const output = {
      output: 'test result line',
      runBy: 'UserA',
      timestamp: Date.now(),
    }

    render(<OutputPanel output={output} onClear={mockClear} language="javascript" />)
    expect(screen.getByText('test result line')).toBeDefined()
    expect(screen.getByText(/UserA/)).toBeDefined()

    const clearBtn = screen.getByRole('button', { name: /Clear/i })
    fireEvent.click(clearBtn)
    expect(mockClear).toHaveBeenCalled()
  })

  it('should render warning if language is not javascript', () => {
    render(<OutputPanel output={null} onClear={vi.fn()} language="python" />)
    expect(screen.getByText(/JavaScript only/i)).toBeDefined()
  })
})
