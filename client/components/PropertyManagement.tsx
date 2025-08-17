import { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

interface Property {
  id: number
  address: string
  unit?: string
  rent_amount: number
  payment_frequency: 'weekly' | 'monthly'
  status: 'available' | 'occupied' | 'maintenance'
  total_units: number
  occupied_units: number
}

interface Tenant {
  id: number
  name: string
  email: string
  phone?: string
  profile_photo?: string
  unit?: string
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

function PropertyManagement() {
  const { user } = useAuth0()
  const [properties, setProperties] = useState<Property[]>([])
  const [availableTenants, setAvailableTenants] = useState<Tenant[]>([])
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null)
  const [showAssignmentModal, setShowAssignmentModal] = useState(false)
  const [showAddUnitModal, setShowAddUnitModal] = useState(false)
  const [showEditUnitModal, setShowEditUnitModal] = useState(false)
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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
          rent_amount: 2400,
          payment_frequency: 'monthly',
          status: 'occupied',
          total_units: 4,
          occupied_units: 3
        },
        {
          id: 2,
          address: '456 Oak Ave',
          rent_amount: 1500,
          payment_frequency: 'weekly',
          status: 'available',
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
        },
        {
          id: 3,
          name: 'Mike Johnson',
          email: 'mike@example.com',
          phone: '+1 (555) 345-6789',
          rent_amount: 800,
          payment_frequency: 'weekly',
          lease_start: '2023-03-01',
          lease_end: '2024-02-29',
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
    // Mock units data - in real app, this would come from API
    const mockUnits: Unit[] = [
      {
        id: 1,
        property_id: 1,
        unit_number: 'Apt 1A',
        rent_amount: 600,
        payment_frequency: 'weekly',
        status: 'occupied',
        tenant_id: 1,
        tenant_name: 'John Doe',
        lease_start: '2023-01-01',
        lease_end: '2024-12-31'
      },
      {
        id: 2,
        property_id: 1,
        unit_number: 'Apt 1B',
        rent_amount: 600,
        payment_frequency: 'weekly',
        status: 'occupied',
        tenant_id: 2,
        tenant_name: 'Jane Smith',
        lease_start: '2023-06-01',
        lease_end: '2024-05-31'
      },
      {
        id: 3,
        property_id: 1,
        unit_number: 'Apt 2A',
        rent_amount: 600,
        payment_frequency: 'weekly',
        status: 'occupied',
        tenant_id: 3,
        tenant_name: 'Mike Johnson',
        lease_start: '2023-03-01',
        lease_end: '2024-02-29'
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

  const handleRemoveTenant = async (unitId: number, propertyId: number, tenantName?: string) => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to remove ${tenantName || 'this tenant'} from this unit? This action cannot be undone.`
    )
    
    if (!confirmed) return

    try {
      // TODO: API call to remove tenant
      console.log('Removing tenant from unit:', unitId)
      
      // Update local state - remove tenant from unit
      const updatedUnits = getUnitsForProperty(propertyId).map(unit => 
        unit.id === unitId 
          ? { ...unit, tenant_id: undefined, tenant_name: undefined, status: 'available' as const }
          : unit
      )
      
      // Update property occupied count
      setProperties(prev => prev.map(p => 
        p.id === propertyId 
          ? { ...p, occupied_units: Math.max(0, p.occupied_units - 1) }
          : p
      ))
      
      // Show success message (in real app, you'd use a toast notification)
      alert('Tenant removed successfully!')
    } catch (error) {
      console.error('Error removing tenant:', error)
      alert('Error removing tenant. Please try again.')
    }
  }

  const handleConfirmAssignment = async () => {
    if (!selectedProperty || !selectedUnit || !selectedTenant) return

    try {
      // TODO: API call to assign tenant
      console.log('Assigning tenant:', selectedTenant.id, 'to unit:', selectedUnit.id)
      
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
    } catch (error) {
      console.error('Error assigning tenant:', error)
    }
  }

  const handleAddUnit = () => {
    setShowAddUnitModal(true)
  }

  const handleEditUnit = (unit: Unit) => {
    setEditingUnit(unit)
    setShowEditUnitModal(true)
  }

  const handleSaveUnitEdit = async () => {
    if (!editingUnit) return

    try {
      // TODO: API call to update unit
      console.log('Saving unit edits:', editingUnit)
      
      // Update local state
      // In real app, you'd update the units array
      
      setShowEditUnitModal(false)
      setEditingUnit(null)
      alert('Unit updated successfully!')
    } catch (error) {
      console.error('Error updating unit:', error)
      alert('Error updating unit. Please try again.')
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
          <h2 className="text-2xl font-bold text-gray-900">Property Management</h2>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add New Property
          </button>
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
                    <p className="text-gray-500">
                      Payment Frequency: {property.payment_frequency}
                    </p>
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
                            : unit.status === 'maintenance'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {unit.status}
                        </span>
                      </div>

                      {unit.tenant_name ? (
                        <div className="mb-3">
                          <p className="text-sm text-gray-600">Current Tenant:</p>
                          <div className="flex items-center space-x-2 mt-1">
                            {unit.tenant_name && (
                              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium">
                                  {unit.tenant_name.charAt(0)}
                                </span>
                              </div>
                            )}
                            <span className="text-sm font-medium">{unit.tenant_name}</span>
                          </div>
                          {unit.lease_end && (
                            <p className="text-xs text-gray-500 mt-1">
                              Lease ends: {new Date(unit.lease_end).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 mb-3">No tenant assigned</p>
                      )}

                      <div className="space-x-2">
                                                 {unit.tenant_id ? (
                           <button
                             onClick={() => handleRemoveTenant(unit.id, property.id, unit.tenant_name)}
                             className="text-xs text-red-600 hover:text-red-800"
                           >
                             Remove Tenant
                           </button>
                         ) : (
                          <button
                            onClick={() => handleAssignTenant(property, unit)}
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            Assign Tenant
                          </button>
                        )}
                                                 <button 
                           onClick={() => handleEditUnit(unit)}
                           className="text-xs text-gray-600 hover:text-gray-800"
                         >
                           Edit Unit
                         </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add Unit Button */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center">
                    <button
                      onClick={handleAddUnit}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <p className="text-sm mt-2">Add Unit</p>
                    </button>
                  </div>
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

                 {/* Add Unit Modal */}
         {showAddUnitModal && (
           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
             <div className="bg-white rounded-lg p-6 w-full max-w-md">
               <h3 className="text-lg font-semibold mb-4">Add New Unit</h3>
               
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Unit Number
                   </label>
                   <input
                     type="text"
                     placeholder="e.g., Apt 3A"
                     className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                   />
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Monthly Rent
                   </label>
                   <input
                     type="number"
                     placeholder="1200"
                     className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                   />
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Payment Frequency
                   </label>
                   <select className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500">
                     <option value="monthly">Monthly</option>
                     <option value="weekly">Weekly</option>
                   </select>
                 </div>
               </div>

               <div className="flex gap-3 mt-6">
                 <button
                   onClick={() => setShowAddUnitModal(false)}
                   className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                 >
                   Cancel
                 </button>
                 <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                   Add Unit
                 </button>
               </div>
             </div>
           </div>
         )}

         {/* Edit Unit Modal */}
         {showEditUnitModal && editingUnit && (
           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
             <div className="bg-white rounded-lg p-6 w-full max-w-md">
               <h3 className="text-lg font-semibold mb-4">Edit Unit: {editingUnit.unit_number}</h3>
               
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Unit Number
                   </label>
                   <input
                     type="text"
                     defaultValue={editingUnit.unit_number}
                     className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                   />
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Rent Amount
                   </label>
                   <input
                     type="number"
                     defaultValue={editingUnit.rent_amount}
                     className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                   />
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Payment Frequency
                   </label>
                   <select 
                     defaultValue={editingUnit.payment_frequency}
                     className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                   >
                     <option value="monthly">Monthly</option>
                     <option value="weekly">Weekly</option>
                   </select>
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Status
                   </label>
                   <select 
                     defaultValue={editingUnit.status}
                     className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                   >
                     <option value="available">Available</option>
                     <option value="occupied">Occupied</option>
                     <option value="maintenance">Maintenance</option>
                   </select>
                 </div>
               </div>

               <div className="flex gap-3 mt-6">
                 <button
                   onClick={() => {
                     setShowEditUnitModal(false)
                     setEditingUnit(null)
                   }}
                   className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                 >
                   Cancel
                 </button>
                 <button 
                   onClick={handleSaveUnitEdit}
                   className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                 >
                   Save Changes
                 </button>
               </div>
             </div>
           </div>
         )}
      </div>
    </div>
  )
}

export default PropertyManagement 