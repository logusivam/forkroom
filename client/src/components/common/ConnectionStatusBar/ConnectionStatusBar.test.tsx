import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ConnectionStatusBar } from './ConnectionStatusBar'

describe('ConnectionStatusBar', () => {
  it('should render connected state', () => {
    render(<ConnectionStatusBar status="connected" />)
    expect(screen.getByText('Connected')).toBeDefined()
  })

  it('should render reconnecting state', () => {
    render(<ConnectionStatusBar status="reconnecting" />)
    expect(screen.getByText('Reconnecting')).toBeDefined()
  })
})
