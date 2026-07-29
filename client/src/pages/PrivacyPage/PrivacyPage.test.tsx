import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { HelmetProvider } from 'react-helmet-async'
import { PrivacyPage } from './PrivacyPage'

describe('PrivacyPage', () => {
  it('should render privacy title and sections', () => {
    render(
      <HelmetProvider>
        <PrivacyPage />
      </HelmetProvider>
    )
    const heading = screen.getByRole('heading', { name: /Privacy Policy/i })
    expect(heading).toBeDefined()

    const sectionText = screen.getByText(/Information Collection/i)
    expect(sectionText).toBeDefined()
  })
})
