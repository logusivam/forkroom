import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TemporaryContentBanner } from './TemporaryContentBanner'

describe('TemporaryContentBanner', () => {
  it('should render banner content', () => {
    render(<TemporaryContentBanner />)
    expect(screen.getByText(/Content is temporary/i)).toBeDefined()
  })

  it('should dismiss when clicking dismiss', () => {
    render(<TemporaryContentBanner />)
    const button = screen.getByRole('button', { name: /Dismiss/i })
    fireEvent.click(button)
    expect(screen.queryByText(/Content is temporary/i)).toBeNull()
  })
})
