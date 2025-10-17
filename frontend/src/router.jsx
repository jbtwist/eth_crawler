/* According to TanStack Router documentation, it is not recommended to use 
*  File-Based Routing for big and scalable applications, but for this assessment, 
*  I've gone with it for simplicity.
*  https://tanstack.com/router/latest/docs/framework/react/decisions-on-dx
*/

import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router'
import App from './App'
import Home from './pages/Home'
import Transactions from './pages/Transactions'


// Root route
const rootRoute = createRootRoute({
  component: App,
})

// Index route (Home)
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
})

// Transactions route with search params
const transactionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/transactions',
  component: Transactions,
  validateSearch: (search) => ({
    address: search.address,
    from: search.from || '0',
    until: search.until || 'latest',
  }),
})

// Create the route tree
const routeTree = rootRoute.addChildren([indexRoute, transactionsRoute])

// Create and export the router
export const router = createRouter({ routeTree })