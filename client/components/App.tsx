import { useAuth0 } from '@auth0/auth0-react'
import { useState, useEffect } from 'react'
import RoleSelection from './RoleSelection.tsx'
import OwnerDashboard from './OwnerDashboard.tsx'
import TenantDashboard from './TenantDashboard.tsx'

function App() {
  const { isAuthenticated, isLoading, user, loginWithRedirect, logout } = useAuth0()
  const [userRole, setUserRole] = useState<'owner' | 'tenant' | null>(null)
  const [isLoadingRole, setIsLoadingRole] = useState(false)

  // Check if user has already selected a role (in real app, this would come from database)
  useEffect(() => {
    if (isAuthenticated && !userRole) {
      // TODO: Fetch user role from database
      // For now, we'll show role selection
      setIsLoadingRole(false)
    }
  }, [isAuthenticated, userRole])

  const handleRoleSelected = (role: 'owner' | 'tenant') => {
    setUserRole(role)
    // TODO: Save role to database
  }

  if (isLoading || isLoadingRole) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">🏠 Rent Link</h1>
            </div>
            
            {isAuthenticated && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {userRole === 'owner' ? 'Property Owner' : userRole === 'tenant' ? 'Tenant' : ''}
                </span>
                <button 
                  onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto mt-20 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Rent Link</h2>
            <p className="text-gray-600 mb-8">
              Connect landlords and tenants for seamless rental management
            </p>
            <button 
              onClick={() => loginWithRedirect()}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600"
            >
              Get Started
            </button>
          </div>
        ) : userRole === null ? (
          <RoleSelection onRoleSelected={handleRoleSelected} />
        ) : userRole === 'owner' ? (
          <OwnerDashboard />
        ) : (
          <TenantDashboard />
        )}
      </main>
    </div>
  )
}

export default App