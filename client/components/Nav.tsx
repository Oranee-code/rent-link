
import { useAuth0 } from '@auth0/auth0-react'
import { IfAuthenticated, IfNotAuthenticated } from './Authenticated.tsx'

function Nav() {
  const { user, logout, loginWithRedirect } = useAuth0()

  const handleSignOut = () => {
    logout({ logoutParams: { returnTo: window.location.origin } })
  }

  const handleSignIn = () => {
    loginWithRedirect()
  }

  return (
    <>
      <div className="nav-group">
        <IfAuthenticated>
          <button className="nav-button" onClick={handleSignOut}>Sign out</button>
          {user && <p className="signed-in-user">Signed in as: {user.nickname || user.name}</p>}
        </IfAuthenticated>

        <IfNotAuthenticated>
          <button className="nav-button" onClick={handleSignIn}>Sign in</button>
        </IfNotAuthenticated>
      </div>

      <h1 className="nav-title">Weather App</h1>
    </>
  )
}

export default Nav