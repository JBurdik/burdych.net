import { createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Allow per-route page metadata used by the admin shell header.
declare module '@tanstack/react-router' {
  interface StaticDataRouteOption {
    title?: string
    subtitle?: string
  }
}

// Create a new router instance
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  })

  return router
}
