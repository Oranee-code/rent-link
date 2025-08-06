import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import routes from './routes.tsx'
import { Auth0Provider } from '@auth0/auth0-react'

const router = createBrowserRouter(routes)
const queryClient = new QueryClient()

document.addEventListener('DOMContentLoaded', () => {
  createRoot(document.getElementById('app') as HTMLElement).render(
    /**
     * TODO: replace domain, clientId, and audience
     */
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN || "dev-c7tn02knwt43gb5c.us.auth0.com"}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID || "YOUR_CLIENT_ID_HERE"}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE || "https://dev-c7tn02knwt43gb5c.us.auth0.com/api/v2/",
      }}
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </Auth0Provider>,
  )
})
