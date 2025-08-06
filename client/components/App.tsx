import { useAuth0 } from '@auth0/auth0-react'
import Home from './Home.tsx' 

function App() {
  
  const { isAuthenticated, isLoading, user, loginWithRedirect, logout } = useAuth0()

  if (isLoading) return <p>Loading...</p>

  return (
    <div>
      <h1>🌦️ The Weather 🌦️ </h1>

      {/* Not logged in: Show only login button */}
      {!isAuthenticated && (
        <>
          <button onClick={() => loginWithRedirect()}>Log in</button>
          <p>Please log in to view the weather.</p>
        </>
      )}

      {/* Logged in: Show welcome message, logout button, and weather search */}
      {isAuthenticated && (
        <>
          <p>Welcome, {user?.name || 'User'}!</p>
          <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
            Log out
          </button>
          <Home />
        </>
      )}
    </div>
  )
}

export default App