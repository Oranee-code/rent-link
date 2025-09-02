
import { useAuth0 } from '@auth0/auth0-react'
import { IfAuthenticated, IfNotAuthenticated } from './Authenticated.tsx'
import { Link } from 'react-router-dom'

function Nav() {
  const { user, logout, loginWithRedirect } = useAuth0()

  const handleSignOut = () => {
    logout({ logoutParams: { returnTo: window.location.origin } })
  }

  const handleSignIn = () => {
    loginWithRedirect()
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="nav-title">Rent Link</h1>
          </div>
          
          <div className="nav-group">
            <IfAuthenticated>
              <Link to="/profile" className="nav-button">Profile</Link>
              <button className="nav-button" onClick={handleSignOut}>Sign out</button>
              {user && <p className="signed-in-user">Signed in as: {user.nickname || user.name}</p>}
            </IfAuthenticated>

            <IfNotAuthenticated>
              <button className="nav-button" onClick={handleSignIn}>Sign in</button>
            </IfNotAuthenticated>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Nav