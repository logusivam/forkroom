import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { HelmetProvider } from 'react-helmet-async'
import { LandingPage } from './LandingPage'

const mockNavigate = vi.fn()

vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}))

describe('LandingPage', () => {
  it('should render landing title and description text', () => {
    render(
      <HelmetProvider>
        <LandingPage />
      </HelmetProvider>
    )
    expect(screen.getByText('FORKROOM')).toBeDefined()
    expect(screen.getByText(/Join Existing Room/i)).toBeDefined()
  })

  it('should submit room ID and navigate', () => {
    render(
      <HelmetProvider>
        <LandingPage />
      </HelmetProvider>
    )
    const input = screen.getByPlaceholderText('e.g. workspace-alpha')
    fireEvent.change(input, { target: { value: 'custom-room-123' } })

    const joinBtn = screen.getByRole('button', { name: /Join Existing Room/i })
    fireEvent.click(joinBtn)

    expect(mockNavigate).toHaveBeenCalledWith('/room/custom-room-123')
  })

  it('should navigate to random room on button click', () => {
    render(
      <HelmetProvider>
        <LandingPage />
      </HelmetProvider>
    )
    const randomBtn = screen.getByRole('button', { name: /Create Random Room/i })
    fireEvent.click(randomBtn)

    expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining('/room/'))
  })
})
