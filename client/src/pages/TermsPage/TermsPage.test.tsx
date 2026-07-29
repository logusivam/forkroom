import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { HelmetProvider } from 'react-helmet-async'
import { TermsPage } from './TermsPage'

describe('TermsPage', () => {
  it('should render terms title and sections', () => {
    render(
      <HelmetProvider>
        <TermsPage />
      </HelmetProvider>
    )
    const heading = screen.getByRole('heading', { name: /Terms of Service/i })
    expect(heading).toBeDefined()

    const sectionText = screen.getByText(/Acceptance of Terms/i)
    expect(sectionText).toBeDefined()
  })
})
