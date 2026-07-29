import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HelmetProvider } from 'react-helmet-async'
import { EditorPage } from './EditorPage'

const mockNavigate = vi.fn()
let mockRoomId: string | undefined = undefined

vi.mock('react-router', () => ({
  useParams: () => ({ roomId: mockRoomId }),
  useNavigate: () => mockNavigate,
}))

describe('EditorPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRoomId = undefined
  })

  it('should redirect to landing page if roomId is missing', () => {
    render(
      <HelmetProvider>
        <EditorPage />
      </HelmetProvider>
    )
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true })
  })

  it('should render room heading if roomId is present after entering name', () => {
    mockRoomId = 'test-room-123'
    render(
      <HelmetProvider>
        <EditorPage />
      </HelmetProvider>
    )

    // Verify it initially renders name input form
    expect(screen.getByText('Join Room')).toBeDefined()

    // Simulate name entry
    const input = screen.getByPlaceholderText('e.g. Loganathan')
    fireEvent.change(input, { target: { value: 'Loganathan' } })

    const submitBtn = screen.getByRole('button', { name: /Enter Room/i })
    fireEvent.click(submitBtn)

    // Verify editor page is now loaded
    const heading = screen.getByText('ROOM:')
    expect(heading).toBeDefined()
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
