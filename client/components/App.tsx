import { useAuth0 } from '@auth0/auth0-react'
import Home from './Home.tsx'
import Nav from './Nav.tsx' 

function App() {
  
  const { isAuthenticated, isLoading, user, loginWithRedirect, logout } = useAuth0()

  if (isLoading) return <p>Loading...</p>

  return (
    <div>
      <Nav />
      
      {/* Not logged in: Show only login button */}
      {!isAuthenticated && (
        <div className="container mx-auto p-6">
          <h1 className="text-3xl font-bold mb-4">Welcome to Rent Link</h1>
          <button 
            onClick={() => loginWithRedirect()}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Log in
          </button>
          <p className="mt-4 text-gray-600">Please log in to access your rental dashboard.</p>
        </div>
      )}

      {/* Logged in: Show main content */}
      {isAuthenticated && (
        <div className="container mx-auto p-6">
          <Home />
        </div>
      )}
    </div>
  )
}

export default App