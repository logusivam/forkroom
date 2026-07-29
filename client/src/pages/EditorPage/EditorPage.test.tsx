import { render, screen } from '@testing-library/react'
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

  it('should render room heading if roomId is present', () => {
    mockRoomId = 'test-room-123'
    render(
      <HelmetProvider>
        <EditorPage />
      </HelmetProvider>
    )
    const heading = screen.getByRole('heading', { name: /Room: test-room-123/i })
    expect(heading).toBeDefined()
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
