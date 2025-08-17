import { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

interface Property {
  id: number
  address: string
  unit?: string
  rent_amount: number
  status: 'available' | 'occupied' | 'maintenance'
  tenant_id?: number
  tenant_name?: string
  tenant_photo?: string
}

interface Tenant {
  id: number
  name: string
  email: string
  profile_photo?: string
}

function PropertyAssignment() {
  const { user } = useAuth0()
  const [properties, setProperties] = useState<Property[]>([])
  const [availableTenants, setAvailableTenants] = useState<Tenant[]>([])
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAssignmentModal, setShowAssignmentModal] = useState(false)

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
          unit: 'Apt 2B',
          rent_amount: 1200,
          status: 'available'
        },
        {
          id: 2,
          address: '456 Oak Ave',
          unit: 'Unit 5',
          rent_amount: 1500,
          status: 'occupied',
          tenant_id: 1,
          tenant_name: 'John Doe'
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
          profile_photo: '/uploads/profiles/john.jpg'
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com'
        },
        {
          id: 3,
          name: 'Mike Johnson',
          email: 'mike@example.com'
        }
      ]
      setAvailableTenants(mockTenants)
    } catch (error) {
      console.error('Error fetching tenants:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAssignTenant = (property: Property) => {
    setSelectedProperty(property)
    setShowAssignmentModal(true)
  }

  const handleRemoveTenant = async (propertyId: number) => {
    try {
      // TODO: API call to remove tenant
      console.log('Removing tenant from property:', propertyId)
      
      // Update local state
      setProperties(prev => prev.map(p => 
        p.id === propertyId 
          ? { ...p, tenant_id: undefined, tenant_name: undefined, status: 'available' }
          : p
      ))
    } catch (error) {
      console.error('Error removing tenant:', error)
    }
  }

  const handleConfirmAssignment = async () => {
    if (!selectedProperty || !selectedTenant) return

    try {
      // TODO: API call to assign tenant
      console.log('Assigning tenant:', selectedTenant.id, 'to property:', selectedProperty.id)
      
      // Update local state
      setProperties(prev => prev.map(p => 
        p.id === selectedProperty.id 
          ? { ...p, tenant_id: selectedTenant.id, tenant_name: selectedTenant.name, status: 'occupied' }
          : p
      ))
      
      setShowAssignmentModal(false)
      setSelectedProperty(null)
      setSelectedTenant(null)
    } catch (error) {
      console.error('Error assigning tenant:', error)
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
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Property Management</h2>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add New Property
          </button>
        </div>

        <div className="grid gap-6">
          {properties.map((property) => (
            <div key={property.id} className="border rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{property.address}</h3>
                  {property.unit && (
                    <p className="text-gray-600">{property.unit}</p>
                  )}
                  <p className="text-gray-500">Rent: ${property.rent_amount}/month</p>
                  
                  {property.tenant_name ? (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600">Current Tenant:</p>
                      <div className="flex items-center space-x-2 mt-1">
                                                 {property.tenant_photo && (
                           <img 
                             src={property.tenant_photo} 
                             alt="Tenant" 
                             className="w-8 h-8 rounded-full"
                           />
                         )}
                        <span className="font-medium">{property.tenant_name}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-3">No tenant assigned</p>
                  )}
                </div>
                
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    property.status === 'occupied' 
                      ? 'bg-green-100 text-green-800'
                      : property.status === 'maintenance'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {property.status}
                  </span>
                  
                  <div className="mt-3 space-x-2">
                    {property.tenant_id ? (
                      <button
                        onClick={() => handleRemoveTenant(property.id)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Remove Tenant
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAssignTenant(property)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Assign Tenant
                      </button>
                    )}
                    <button className="text-sm text-gray-600 hover:text-gray-800">
                      Edit Property
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Assignment Modal */}
        {showAssignmentModal && selectedProperty && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">
                Assign Tenant to {selectedProperty.address}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Tenant
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
                        {tenant.name} ({tenant.email})
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
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAssignmentModal(false)
                    setSelectedProperty(null)
                    setSelectedTenant(null)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAssignment}
                  disabled={!selectedTenant}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  Assign Tenant
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PropertyAssignment 