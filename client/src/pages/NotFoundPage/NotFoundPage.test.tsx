import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router'
import { NotFoundPage } from './NotFoundPage'

describe('NotFoundPage', () => {
  it('should render 404 text and link back to landing page', () => {
    render(
      <HelmetProvider>
        <BrowserRouter>
          <NotFoundPage />
        </BrowserRouter>
      </HelmetProvider>
    )
    const heading = screen.getByRole('heading', { name: /404/i })
    expect(heading).toBeDefined()

    const link = screen.getByRole('link', { name: /Go to Home/i })
    expect(link).toBeDefined()
  })
})
