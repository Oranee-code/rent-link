import { useAuth0 } from '@auth0/auth0-react'

function AuthTest() {
  const { 
    isAuthenticated, 
    isLoading, 
    error, 
    user, 
    loginWithRedirect, 
    logout,
    getAccessTokenSilently 
  } = useAuth0()

  const handleTestToken = async () => {
    try {
      const token = await getAccessTokenSilently()
      console.log('Access token:', token)
      alert('Token retrieved successfully! Check console for details.')
    } catch (err) {
      console.error('Error getting token:', err)
      alert('Error getting token. Check console for details.')
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Auth0 Test Component</h2>
      
      <div className="space-y-4">
        <div>
          <strong>Authentication Status:</strong> {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
        </div>
        
        {user && (
          <div>
            <strong>User:</strong> {user.name} ({user.email})
          </div>
        )}
        
        <div className="space-x-2">
          {!isAuthenticated ? (
            <button 
              onClick={() => loginWithRedirect()}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Login
            </button>
          ) : (
            <>
              <button 
                onClick={handleTestToken}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Test Token
              </button>
              <button 
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </>
          )}
        </div>
        
        <div className="text-sm text-gray-600">
          <p>Domain: {import.meta.env.VITE_AUTH0_DOMAIN}</p>
          <p>Client ID: {import.meta.env.VITE_AUTH0_CLIENT_ID}</p>
          <p>Callback URL: {import.meta.env.VITE_AUTH0_CALLBACK_URL}</p>
          <p>Audience: {import.meta.env.VITE_AUTH0_AUDIENCE}</p>
        </div>
      </div>
    </div>
  )
}

export default AuthTest
