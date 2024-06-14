import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Provider } from 'react-redux'
import { store } from './store.js'
import Index from './pages/Index.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import JobDetails from './pages/JobDetails.jsx'
import UserDetails from './pages/UserDetails.jsx'
import CreateJob from './pages/CreateJob.jsx'
import { Toaster } from "@/components/ui/toaster"


const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/jobs/:jobId",
    element: <JobDetails />,
  },
  {
    path: "/profile",
    element: <UserDetails />,
  },
  {
    path: "/create-job",
    element: <CreateJob />,
  }
])

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
)
