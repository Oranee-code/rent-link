import { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

interface Tenant {
  id: number
  name: string
  email: string
  phone?: string
  profile_photo?: string
  rent_amount: number
  payment_frequency: 'weekly' | 'monthly'
  lease_start: string
  lease_end: string
  status: 'active' | 'expired' | 'terminated'
}

interface Unit {
  id: number
  property_id: number
  unit_number: string
  rent_amount: number
  payment_frequency: 'weekly' | 'monthly'
  status: 'available' | 'occupied' | 'maintenance'
  tenant_id?: number
  tenant_name?: string
  lease_start?: string
  lease_end?: string
}

interface Property {
  id: number
  address: string
  total_units: number
  occupied_units: number
}

function TenantAssignment() {
  const { user } = useAuth0()
  const [properties, setProperties] = useState<Property[]>([])
  const [availableTenants, setAvailableTenants] = useState<Tenant[]>([])
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null)
  const [showAssignmentModal, setShowAssignmentModal] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showCreateTenantModal, setShowCreateTenantModal] = useState(false)
  const [assignmentMode, setAssignmentMode] = useState<'existing' | 'invite' | 'create'>('existing')
  const [isLoading, setIsLoading] = useState(true)

  // Form states for new tenant creation
  const [newTenantData, setNewTenantData] = useState({
    name: '',
    email: '',
    phone: '',
    rent_amount: 0,
    payment_frequency: 'monthly' as 'weekly' | 'monthly',
    lease_start: '',
    lease_end: ''
  })

  // Form states for tenant invitation
  const [inviteData, setInviteData] = useState({
    email: '',
    message: ''
  })

  useEffect(() => {
    fetchProperties()
    fetchAvailableTenants()
  }, [])

  const fetchProperties = async () => {
    try {
      // TODO: Replace with actual API call
      const mockProperties: Property[] = [
        {
          id: 1,
          address: '123 Main St',
          total_units: 4,
          occupied_units: 2
        },
        {
          id: 2,
          address: '456 Oak Ave',
          total_units: 2,
          occupied_units: 1
        }
      ]
      setProperties(mockProperties)
    } catch (error) {
      console.error('Error fetching properties:', error)
    }
  }

  const fetchAvailableTenants = async () => {
    try {
      // TODO: Replace with actual API call
      const mockTenants: Tenant[] = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1 (555) 123-4567',
          profile_photo: '/uploads/profiles/john.jpg',
          rent_amount: 600,
          payment_frequency: 'weekly',
          lease_start: '2023-01-01',
          lease_end: '2024-12-31',
          status: 'active'
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+1 (555) 234-5678',
          rent_amount: 1200,
          payment_frequency: 'monthly',
          lease_start: '2023-06-01',
          lease_end: '2024-05-31',
          status: 'active'
        }
      ]
      setAvailableTenants(mockTenants)
    } catch (error) {
      console.error('Error fetching tenants:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getUnitsForProperty = (propertyId: number): Unit[] => {
    // Mock units data
    const mockUnits: Unit[] = [
      {
        id: 1,
        property_id: 1,
        unit_number: 'Apt 1A',
        rent_amount: 600,
        payment_frequency: 'weekly',
        status: 'occupied',
        tenant_id: 1,
        tenant_name: 'John Doe'
      },
      {
        id: 2,
        property_id: 1,
        unit_number: 'Apt 1B',
        rent_amount: 600,
        payment_frequency: 'weekly',
        status: 'available'
      },
      {
        id: 3,
        property_id: 1,
        unit_number: 'Apt 2A',
        rent_amount: 600,
        payment_frequency: 'weekly',
        status: 'occupied',
        tenant_id: 2,
        tenant_name: 'Jane Smith'
      },
      {
        id: 4,
        property_id: 1,
        unit_number: 'Apt 2B',
        rent_amount: 600,
        payment_frequency: 'weekly',
        status: 'available'
      }
    ]
    return mockUnits.filter(unit => unit.property_id === propertyId)
  }

  const handleAssignTenant = (property: Property, unit: Unit) => {
    setSelectedProperty(property)
    setSelectedUnit(unit)
    setShowAssignmentModal(true)
  }

  const handleAssignExistingTenant = async () => {
    if (!selectedProperty || !selectedUnit || !selectedTenant) return

    try {
      // TODO: API call to assign existing tenant
      console.log('Assigning existing tenant:', selectedTenant.id, 'to unit:', selectedUnit.id)
      
      // Update local state
      setProperties(prev => prev.map(p => 
        p.id === selectedProperty.id 
          ? { ...p, occupied_units: p.occupied_units + 1 }
          : p
      ))
      
      setShowAssignmentModal(false)
      setSelectedProperty(null)
      setSelectedUnit(null)
      setSelectedTenant(null)
      alert('Tenant assigned successfully!')
    } catch (error) {
      console.error('Error assigning tenant:', error)
      alert('Error assigning tenant. Please try again.')
    }
  }

  const handleInviteTenant = async () => {
    if (!inviteData.email) {
      alert('Please enter an email address.')
      return
    }

    try {
      // TODO: API call to send invitation
      console.log('Sending invitation to:', inviteData.email)
      
      setShowInviteModal(false)
      setInviteData({ email: '', message: '' })
      alert('Invitation sent successfully!')
    } catch (error) {
      console.error('Error sending invitation:', error)
      alert('Error sending invitation. Please try again.')
    }
  }

  const handleCreateTenant = async () => {
    if (!newTenantData.name || !newTenantData.email) {
      alert('Please fill in all required fields.')
      return
    }

    try {
      // TODO: API call to create new tenant
      console.log('Creating new tenant:', newTenantData)
      
      setShowCreateTenantModal(false)
      setNewTenantData({
        name: '',
        email: '',
        phone: '',
        rent_amount: 0,
        payment_frequency: 'monthly',
        lease_start: '',
        lease_end: ''
      })
      alert('Tenant created and assigned successfully!')
    } catch (error) {
      console.error('Error creating tenant:', error)
      alert('Error creating tenant. Please try again.')
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
          <h2 className="text-2xl font-bold text-gray-900">Tenant Assignment</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowInviteModal(true)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Invite New Tenant
            </button>
            <button 
              onClick={() => setShowCreateTenantModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Create Tenant Account
            </button>
          </div>
        </div>

        <div className="grid gap-6">
          {properties.map((property) => {
            const units = getUnitsForProperty(property.id)
            return (
              <div key={property.id} className="border rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{property.address}</h3>
                    <p className="text-gray-600">
                      {property.occupied_units}/{property.total_units} units occupied
                    </p>
                  </div>
                </div>

                {/* Units Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {units.map((unit) => (
                    <div key={unit.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">{unit.unit_number}</h4>
                          <p className="text-sm text-gray-600">
                            ${unit.rent_amount}/{unit.payment_frequency === 'weekly' ? 'week' : 'month'}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          unit.status === 'occupied' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {unit.status}
                        </span>
                      </div>

                      {unit.tenant_name ? (
                        <div className="mb-3">
                          <p className="text-sm text-gray-600">Current Tenant:</p>
                          <span className="text-sm font-medium">{unit.tenant_name}</span>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 mb-3">No tenant assigned</p>
                      )}

                      <div className="space-x-2">
                        {!unit.tenant_id && (
                          <button
                            onClick={() => handleAssignTenant(property, unit)}
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            Assign Tenant
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Assignment Modal */}
        {showAssignmentModal && selectedProperty && selectedUnit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">
                Assign Tenant to {selectedUnit.unit_number}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Existing Tenant
                  </label>
                  <select
                    value={selectedTenant?.id || ''}
                    onChange={(e) => {
                      const tenant = availableTenants.find(t => t.id === parseInt(e.target.value))
                      setSelectedTenant(tenant || null)
                    }}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose a tenant...</option>
                    {availableTenants.map((tenant) => (
                      <option key={tenant.id} value={tenant.id}>
                        {tenant.name} ({tenant.email}) - ${tenant.rent_amount}/{tenant.payment_frequency}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedTenant && (
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      {selectedTenant.profile_photo && (
                        <img 
                          src={selectedTenant.profile_photo} 
                          alt="Tenant" 
                          className="w-10 h-10 rounded-full"
                        />
                      )}
                      <div>
                        <p className="font-medium">{selectedTenant.name}</p>
                        <p className="text-sm text-gray-600">{selectedTenant.email}</p>
                        <p className="text-sm text-gray-600">
                          ${selectedTenant.rent_amount}/{selectedTenant.payment_frequency}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Unit Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Unit:</span>
                      <span>{selectedUnit.unit_number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rent:</span>
                      <span>${selectedUnit.rent_amount}/{selectedUnit.payment_frequency}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAssignmentModal(false)
                    setSelectedProperty(null)
                    setSelectedUnit(null)
                    setSelectedTenant(null)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignExistingTenant}
                  disabled={!selectedTenant}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  Assign Tenant
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Invite Tenant Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Invite New Tenant</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
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
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowInviteModal(false)
                    setInviteData({ email: '', message: '' })
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInviteTenant}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Tenant Modal */}
        {showCreateTenantModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Create New Tenant Account</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={newTenantData.name}
                    onChange={(e) => setNewTenantData({...newTenantData, name: e.target.value})}
                    placeholder="John Doe"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={newTenantData.email}
                    onChange={(e) => setNewTenantData({...newTenantData, email: e.target.value})}
                    placeholder="john@example.com"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={newTenantData.phone}
                    onChange={(e) => setNewTenantData({...newTenantData, phone: e.target.value})}
                    placeholder="+1 (555) 123-4567"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Rent
                  </label>
                  <input
                    type="number"
                    value={newTenantData.rent_amount}
                    onChange={(e) => setNewTenantData({...newTenantData, rent_amount: parseInt(e.target.value) || 0})}
                    placeholder="1200"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Frequency
                  </label>
                  <select
                    value={newTenantData.payment_frequency}
                    onChange={(e) => setNewTenantData({...newTenantData, payment_frequency: e.target.value as 'weekly' | 'monthly'})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lease Start Date
                    </label>
                    <input
                      type="date"
                      value={newTenantData.lease_start}
                      onChange={(e) => setNewTenantData({...newTenantData, lease_start: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lease End Date
                    </label>
                    <input
                      type="date"
                      value={newTenantData.lease_end}
                      onChange={(e) => setNewTenantData({...newTenantData, lease_end: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowCreateTenantModal(false)
                    setNewTenantData({
                      name: '',
                      email: '',
                      phone: '',
                      rent_amount: 0,
                      payment_frequency: 'monthly',
                      lease_start: '',
                      lease_end: ''
                    })
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTenant}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Create Tenant
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TenantAssignment 