import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router'
import { PrivacyPage } from './PrivacyPage'

describe('PrivacyPage', () => {
  it('should render privacy title and sections', () => {
    render(
      <MemoryRouter>
        <HelmetProvider>
          <PrivacyPage />
        </HelmetProvider>
      </MemoryRouter>
    )
    const heading = screen.getByRole('heading', { name: /Privacy Policy/i })
    expect(heading).toBeDefined()

    const sectionText = screen.getByText(/What Data We Collect/i)
    expect(sectionText).toBeDefined()
  })
})
