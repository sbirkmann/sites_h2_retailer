'use client'

import { PropsWithChildren, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SubblyProvider } from '@subbly/react'
import { CookieConsentProvider } from '@/lib/cookie-consent'
import { CartProvider } from '@/lib/CartContext'

export const Providers = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <SubblyProvider>
      <QueryClientProvider client={queryClient}>
        <CookieConsentProvider>
          <CartProvider>{children}</CartProvider>
        </CookieConsentProvider>
      </QueryClientProvider>
    </SubblyProvider>
  )
}
