import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ToastProvider } from './ToastProvider'

describe('ToastProvider', () => {
  it('should render toasts', () => {
    const mockDismiss = vi.fn()
    const toasts = [
      { id: '1', message: 'UserA joined the room', type: 'join' as const }
    ]

    render(<ToastProvider toasts={toasts} onDismiss={mockDismiss} />)
    expect(screen.getByText('UserA joined the room')).toBeDefined()
  })
})
