import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { UserAvatarList } from './UserAvatarList'

describe('UserAvatarList', () => {
  it('should render initials for displayed users', () => {
    const users = [
      { id: '1', name: 'UserA', colour: '#FF6B6B', joinedAt: 0 },
      { id: '2', name: 'CollabB', colour: '#4ECDC4', joinedAt: 0 }
    ]

    render(<UserAvatarList users={users} />)
    expect(screen.getByText('US')).toBeDefined()
    expect(screen.getByText('CO')).toBeDefined()
  })

  it('should show overflow count if users > 5', () => {
    const users = Array.from({ length: 7 }, (_, i) => ({
      id: String(i),
      name: `User${i}`,
      colour: '#FF6B6B',
      joinedAt: 0
    }))

    render(<UserAvatarList users={users} />)
    expect(screen.getByText('+2')).toBeDefined()
  })

  it('should show colour repeat warnings if users > 8', () => {
    const users = Array.from({ length: 9 }, (_, i) => ({
      id: String(i),
      name: `User${i}`,
      colour: '#FF6B6B',
      joinedAt: 0
    }))

    render(<UserAvatarList users={users} />)
    expect(screen.getByText(/Colours repeat/i)).toBeDefined()
  })
})
