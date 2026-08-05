import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { OutputPanel } from './OutputPanel'

describe('OutputPanel', () => {
  it('should render placeholder text if no output', () => {
    render(<OutputPanel output={null} onClear={vi.fn()} />)
    expect(screen.getByText(/No output/i)).toBeDefined()
  })

  it('should render output logs and trigger clear action', () => {
    const mockClear = vi.fn()
    const output = {
      output: 'test result line',
      runBy: 'UserA',
      timestamp: Date.now(),
    }

    render(<OutputPanel output={output} onClear={mockClear} />)
    expect(screen.getByText('test result line')).toBeDefined()
    expect(screen.getByText(/UserA/)).toBeDefined()

    const clearBtn = screen.getByRole('button', { name: /Clear/i })
    fireEvent.click(clearBtn)
    expect(mockClear).toHaveBeenCalled()
  })

  it('should render placeholder text for other languages', () => {
    render(<OutputPanel output={null} onClear={vi.fn()} />)
    expect(screen.getByText(/No output/i)).toBeDefined()
  })

  it('should render copy button and copy to clipboard without prefixes', () => {
    const mockWriteText = vi.fn().mockImplementation(() => Promise.resolve())
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    })

    const output = {
      output: '[error] Sample Error\nNormal log',
      runBy: 'UserA',
      timestamp: Date.now(),
    }

    render(<OutputPanel output={output} onClear={vi.fn()} />)
    const copyBtn = screen.getByRole('button', { name: /Copy/i })
    expect(copyBtn).toBeDefined()
    fireEvent.click(copyBtn)
    expect(mockWriteText).toHaveBeenCalledWith('Sample Error\nNormal log')
  })
})
