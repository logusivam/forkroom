import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router'
import { LandingPage } from './LandingPage'

const mockNavigate = vi.fn()

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>()
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('LandingPage', () => {
  it('should render landing title and description text', () => {
    render(
      <MemoryRouter>
        <HelmetProvider>
          <LandingPage />
        </HelmetProvider>
      </MemoryRouter>
    )
    expect(screen.getAllByText(/Forkroom/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/Join Room/i)).toBeDefined()
  })

  it('should submit room ID and navigate', () => {
    render(
      <MemoryRouter>
        <HelmetProvider>
          <LandingPage />
        </HelmetProvider>
      </MemoryRouter>
    )
    const input = screen.getByPlaceholderText('Enter room ID or paste link...')
    fireEvent.change(input, { target: { value: 'custom-room-123' } })

    const joinBtn = screen.getByRole('button', { name: /Join Room/i })
    fireEvent.click(joinBtn)

    expect(mockNavigate).toHaveBeenCalledWith('/room/custom-room-123')
  })

  it('should navigate to random room on button click', () => {
    render(
      <MemoryRouter>
        <HelmetProvider>
          <LandingPage />
        </HelmetProvider>
      </MemoryRouter>
    )
    const randomBtn = screen.getByRole('button', { name: /Create New Room/i })
    fireEvent.click(randomBtn)

    expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining('/room/'))
  })
})
