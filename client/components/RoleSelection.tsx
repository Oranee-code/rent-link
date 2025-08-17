import { useAuth0 } from '@auth0/auth0-react'
import { useState } from 'react'

interface RoleSelectionProps {
  onRoleSelected: (role: 'owner' | 'tenant') => void
}

function RoleSelection({ onRoleSelected }: RoleSelectionProps) {
  const { user } = useAuth0()
  const [selectedRole, setSelectedRole] = useState<'owner' | 'tenant' | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleRoleSelect = async (role: 'owner' | 'tenant') => {
    setSelectedRole(role)
    setIsLoading(true)
    
    try {
      // TODO: Save user role to database
      // await saveUserRole(user?.sub, role)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onRoleSelected(role)
    } catch (error) {
      console.error('Failed to save role:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Rent Link</h1>
          <p className="text-gray-600">Please select your role to continue</p>
        </div>

        <div className="space-y-4">
          {/* Owner Card */}
          <div 
            className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
              selectedRole === 'owner' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedRole('owner')}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏠</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Property Owner</h3>
                <p className="text-sm text-gray-600">
                  Manage your properties, view payments, and handle maintenance requests
                </p>
              </div>
            </div>
          </div>

          {/* Tenant Card */}
          <div 
            className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
              selectedRole === 'tenant' 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedRole('tenant')}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Tenant</h3>
                <p className="text-sm text-gray-600">
                  Pay rent, report issues, and communicate with your landlord
                </p>
              </div>
            </div>
          </div>
        </div>

        {selectedRole && (
          <button
            onClick={() => handleRoleSelect(selectedRole)}
            disabled={isLoading}
            className="w-full mt-6 bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Setting up...' : `Continue as ${selectedRole === 'owner' ? 'Owner' : 'Tenant'}`}
          </button>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            You can change your role later in settings
          </p>
        </div>
      </div>
    </div>
  )
}

export default RoleSelection 