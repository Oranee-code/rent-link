import { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

interface Tenant {
  id: number
  name: string
  email: string
  phone?: string
  profile_photo?: string
  created_at: string
  status?: 'active' | 'inactive'
}

interface Invitation {
  id: number
  email: string
  message?: string
  status: 'pending' | 'accepted' | 'expired' | 'cancelled'
  created_at: string
  expires_at: string
  accepted_at?: string
}

function TenantManagement() {
  const { user } = useAuth0()
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [availableTenants, setAvailableTenants] = useState<Tenant[]>([])
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'available' | 'invitations'>('all')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteData, setInviteData] = useState({
    email: '',
    message: '',
    propertyId: '',
    unitId: ''
  })

  useEffect(() => {
    fetchTenants()
    fetchInvitations()
  }, [])

  const fetchTenants = async () => {
    try {
      // TODO: Replace with actual API calls
      const mockTenants: Tenant[] = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1 (555) 123-4567',
          profile_photo: '/uploads/profiles/john.jpg',
          created_at: '2023-01-15',
          status: 'active'
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+1 (555) 234-5678',
          created_at: '2023-02-20',
          status: 'active'
        },
        {
          id: 3,
          name: 'Mike Johnson',
          email: 'mike@example.com',
          phone: '+1 (555) 345-6789',
          profile_photo: '/uploads/profiles/mike.jpg',
          created_at: '2023-03-10',
          status: 'active'
        }
      ]
      setTenants(mockTenants)
      setAvailableTenants(mockTenants.filter(t => t.status === 'active'))
    } catch (error) {
      console.error('Error fetching tenants:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchInvitations = async () => {
    try {
      // TODO: Replace with actual API call
      const mockInvitations: Invitation[] = [
        {
          id: 1,
          email: 'sarah@example.com',
          message: 'Hi Sarah! I have Apt 2B available for $600/week',
          status: 'pending',
          created_at: '2024-01-15T10:30:00Z',
          expires_at: '2024-01-22T10:30:00Z'
        },
        {
          id: 2,
          email: 'david@example.com',
          message: 'Welcome to our property!',
          status: 'accepted',
          created_at: '2024-01-10T14:20:00Z',
          expires_at: '2024-01-17T14:20:00Z',
          accepted_at: '2024-01-12T09:15:00Z'
        }
      ]
      setInvitations(mockInvitations)
    } catch (error) {
      console.error('Error fetching invitations:', error)
    }
  }

  const handleSendInvitation = async () => {
    if (!inviteData.email) {
      alert('Please enter an email address.')
      return
    }

    try {
      // TODO: API call to send invitation
      console.log('Sending invitation to:', inviteData.email)
      
      // Add to local state
      const newInvitation: Invitation = {
        id: Date.now(),
        email: inviteData.email,
        message: inviteData.message,
        status: 'pending',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }
      
      setInvitations(prev => [newInvitation, ...prev])
      setShowInviteModal(false)
      setInviteData({ email: '', message: '', propertyId: '', unitId: '' })
      alert('Invitation sent successfully!')
    } catch (error) {
      console.error('Error sending invitation:', error)
      alert('Error sending invitation. Please try again.')
    }
  }

  const handleCancelInvitation = async (invitationId: number) => {
    try {
      // TODO: API call to cancel invitation
      console.log('Cancelling invitation:', invitationId)
      
      setInvitations(prev => prev.map(inv => 
        inv.id === invitationId 
          ? { ...inv, status: 'cancelled' as const }
          : inv
      ))
      alert('Invitation cancelled successfully!')
    } catch (error) {
      console.error('Error cancelling invitation:', error)
      alert('Error cancelling invitation. Please try again.')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'expired': return 'bg-red-100 text-red-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Tenant Management</h2>
          <button 
            onClick={() => setShowInviteModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Send Invitation
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Tenants ({tenants.length})
            </button>
            <button
              onClick={() => setActiveTab('available')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'available'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Available Tenants ({availableTenants.length})
            </button>
            <button
              onClick={() => setActiveTab('invitations')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'invitations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Invitations ({invitations.length})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-96">
          {activeTab === 'all' && (
            <div className="grid gap-4">
              {tenants.map((tenant) => (
                <div key={tenant.id} className="border rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    {tenant.profile_photo ? (
                      <img 
                        src={tenant.profile_photo} 
                        alt={tenant.name} 
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-500 font-medium">
                          {tenant.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium">{tenant.name}</h3>
                      <p className="text-sm text-gray-600">{tenant.email}</p>
                      {tenant.phone && (
                        <p className="text-sm text-gray-500">{tenant.phone}</p>
                      )}
                      <p className="text-xs text-gray-400">
                        Joined: {new Date(tenant.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-xs ${
                        tenant.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {tenant.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'available' && (
            <div className="grid gap-4">
              {availableTenants.map((tenant) => (
                <div key={tenant.id} className="border rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    {tenant.profile_photo ? (
                      <img 
                        src={tenant.profile_photo} 
                        alt={tenant.name} 
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-500 font-medium">
                          {tenant.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium">{tenant.name}</h3>
                      <p className="text-sm text-gray-600">{tenant.email}</p>
                      {tenant.phone && (
                        <p className="text-sm text-gray-500">{tenant.phone}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                        Available
                      </span>
                      <button className="block text-sm text-blue-600 hover:text-blue-800 mt-1">
                        Assign to Unit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'invitations' && (
            <div className="grid gap-4">
              {invitations.map((invitation) => (
                <div key={invitation.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium">{invitation.email}</h3>
                      {invitation.message && (
                        <p className="text-sm text-gray-600 mt-1">{invitation.message}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        Sent: {new Date(invitation.created_at).toLocaleDateString()}
                      </p>
                      {invitation.accepted_at && (
                        <p className="text-xs text-green-600 mt-1">
                          Accepted: {new Date(invitation.accepted_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(invitation.status)}`}>
                        {invitation.status}
                      </span>
                      {invitation.status === 'pending' && (
                        <button
                          onClick={() => handleCancelInvitation(invitation.id)}
                          className="block text-sm text-red-600 hover:text-red-800 mt-1"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Send Tenant Invitation</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={inviteData.email}
                    onChange={(e) => setInviteData({...inviteData, email: e.target.value})}
                    placeholder="tenant@example.com"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    value={inviteData.message}
                    onChange={(e) => setInviteData({...inviteData, message: e.target.value})}
                    placeholder="Hi! I'd like to invite you to become a tenant..."
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property (Optional)
                    </label>
                    <select
                      value={inviteData.propertyId}
                      onChange={(e) => setInviteData({...inviteData, propertyId: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Property</option>
                      <option value="1">123 Main St</option>
                      <option value="2">456 Oak Ave</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit (Optional)
                    </label>
                    <select
                      value={inviteData.unitId}
                      onChange={(e) => setInviteData({...inviteData, unitId: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Unit</option>
                      <option value="1">Apt 1A</option>
                      <option value="2">Apt 1B</option>
                      <option value="3">Apt 2A</option>
                      <option value="4">Apt 2B</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowInviteModal(false)
                    setInviteData({ email: '', message: '', propertyId: '', unitId: '' })
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendInvitation}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TenantManagement 