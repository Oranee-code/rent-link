import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import ProfileSettings from './ProfileSettings.tsx'
import PropertyManagement from './PropertyManagement.tsx'
import TenantManagement from './TenantManagement.tsx'

function OwnerDashboard() {
  const { user } = useAuth0()
  const [activeTab, setActiveTab] = useState<'properties' | 'tenants' | 'payments' | 'maintenance' | 'messages' | 'profile'>('properties')

  const mockProperties = [
    {
      id: 1,
      address: '123 Main St',
      unit: 'Apt 2B',
      rentAmount: 1200,
      tenantName: 'John Doe',
      tenantEmail: 'john@example.com',
      status: 'occupied',
      nextPayment: '2024-01-15'
    },
    {
      id: 2,
      address: '456 Oak Ave',
      unit: 'Unit 5',
      rentAmount: 1500,
      tenantName: 'Jane Smith',
      tenantEmail: 'jane@example.com',
      status: 'occupied',
      nextPayment: '2024-01-20'
    }
  ]

  const mockPayments = [
    {
      id: 1,
      property: '123 Main St, Apt 2B',
      tenant: 'John Doe',
      type: 'rent',
      amount: 1200,
      dueDate: '2024-01-15',
      status: 'paid',
      proofUploaded: true,
      verified: true
    },
    {
      id: 2,
      property: '456 Oak Ave, Unit 5',
      tenant: 'Jane Smith',
      type: 'rent',
      amount: 1500,
      dueDate: '2024-01-20',
      status: 'pending',
      proofUploaded: false,
      verified: false
    }
  ]

  const mockMaintenance = [
    {
      id: 1,
      property: '123 Main St, Apt 2B',
      tenant: 'John Doe',
      title: 'Leaky Faucet',
      description: 'Kitchen faucet is dripping constantly',
      priority: 'medium',
      status: 'pending',
      category: 'plumbing',
      createdAt: '2024-01-10'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Welcome back, {user?.name}!
            </h2>
            <p className="text-gray-600">Property Owner Dashboard</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Today</p>
            <p className="text-lg font-semibold">{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-600">Total Properties</h3>
            <p className="text-2xl font-bold text-blue-900">{mockProperties.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-600">Monthly Revenue</h3>
            <p className="text-2xl font-bold text-green-900">${mockProperties.reduce((sum, p) => sum + p.rentAmount, 0)}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-600">Pending Payments</h3>
            <p className="text-2xl font-bold text-yellow-900">{mockPayments.filter(p => p.status === 'pending').length}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-red-600">Maintenance Requests</h3>
            <p className="text-2xl font-bold text-red-900">{mockMaintenance.filter(m => m.status === 'pending').length}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
                               <button
                     onClick={() => setActiveTab('properties')}
                     className={`py-2 px-1 border-b-2 font-medium text-sm ${
                       activeTab === 'properties'
                         ? 'border-blue-500 text-blue-600'
                         : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                     }`}
                   >
                     Properties
                   </button>
                   <button
                     onClick={() => setActiveTab('tenants')}
                     className={`py-2 px-1 border-b-2 font-medium text-sm ${
                       activeTab === 'tenants'
                         ? 'border-blue-500 text-blue-600'
                         : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                     }`}
                   >
                     Tenants
                   </button>
                   <button
                     onClick={() => setActiveTab('payments')}
                     className={`py-2 px-1 border-b-2 font-medium text-sm ${
                       activeTab === 'payments'
                         ? 'border-blue-500 text-blue-600'
                         : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                     }`}
                   >
                     Payments
                   </button>
                   <button
                     onClick={() => setActiveTab('maintenance')}
                     className={`py-2 px-1 border-b-2 font-medium text-sm ${
                       activeTab === 'maintenance'
                         ? 'border-blue-500 text-blue-600'
                         : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                     }`}
                   >
                     Maintenance
                   </button>
                   <button
                     onClick={() => setActiveTab('messages')}
                     className={`py-2 px-1 border-b-2 font-medium text-sm ${
                       activeTab === 'messages'
                         ? 'border-blue-500 text-blue-600'
                         : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                     }`}
                   >
                     Messages
                   </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Profile
            </button>
          </nav>
        </div>

        {/* Tab Content */}
                       <div className="min-h-96">
                 {activeTab === 'properties' && <PropertyManagement />}
                 {activeTab === 'tenants' && <TenantManagement />}
                 {activeTab === 'payments' && <PaymentsTab payments={mockPayments} />}
                 {activeTab === 'maintenance' && <MaintenanceTab maintenance={mockMaintenance} />}
                 {activeTab === 'messages' && <MessagesTab />}
                 {activeTab === 'profile' && <ProfileSettings />}
               </div>
      </div>
    </div>
  )
}

function PropertiesTab({ properties }: { properties: any[] }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">My Properties</h3>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Property
        </button>
      </div>
      
      <div className="grid gap-4">
        {properties.map((property) => (
          <div key={property.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium">{property.address}</h4>
                <p className="text-sm text-gray-600">{property.unit}</p>
                <p className="text-sm text-gray-500">Tenant: {property.tenantName}</p>
                <p className="text-sm text-gray-500">Email: {property.tenantEmail}</p>
                <p className="text-sm text-gray-500">Next Payment: {property.nextPayment}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">${property.rentAmount}/month</p>
                <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                  {property.status}
                </span>
                <div className="mt-2 space-x-2">
                  <button className="text-sm text-blue-600 hover:underline">Edit</button>
                  <button className="text-sm text-green-600 hover:underline">View Details</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PaymentsTab({ payments }: { payments: any[] }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Payment Overview</h3>
        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Verify Payments
        </button>
      </div>
      
      <div className="grid gap-4">
        {payments.map((payment) => (
          <div key={payment.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium capitalize">{payment.type}</h4>
                  <span className={`px-2 py-1 rounded text-xs ${
                    payment.status === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : payment.status === 'verified'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {payment.status}
                  </span>
                  {payment.verified && (
                    <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{payment.property}</p>
                <p className="text-sm text-gray-500">Tenant: {payment.tenant}</p>
                <p className="text-sm text-gray-500">Due: {payment.dueDate}</p>
                {payment.proofUploaded && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Proof uploaded</p>
                    <button className="text-sm text-blue-600 hover:underline">
                      View Receipt
                    </button>
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">${payment.amount}</p>
                {payment.proofUploaded && !payment.verified && (
                  <button className="text-sm text-green-600 hover:underline mt-1">
                    Verify Payment
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MaintenanceTab({ maintenance }: { maintenance: any[] }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Maintenance Requests</h3>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          View All
        </button>
      </div>
      
      <div className="grid gap-4">
        {maintenance.map((request) => (
          <div key={request.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium">{request.title}</h4>
                <p className="text-sm text-gray-600">{request.description}</p>
                <p className="text-sm text-gray-500">{request.property}</p>
                <p className="text-sm text-gray-500">Tenant: {request.tenant}</p>
                <p className="text-sm text-gray-500">Category: {request.category}</p>
                <p className="text-sm text-gray-500">Created: {request.createdAt}</p>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded text-xs ${
                  request.priority === 'high' 
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {request.priority}
                </span>
                <p className="text-sm text-gray-500 mt-1 capitalize">{request.status}</p>
                <div className="mt-2 space-x-2">
                  <button className="text-sm text-blue-600 hover:underline">Update</button>
                  <button className="text-sm text-green-600 hover:underline">Complete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MessagesTab() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Messages</h3>
      <div className="border rounded-lg p-4 h-96 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p>Chat functionality coming soon!</p>
          <p className="text-sm">You'll be able to message your tenants here.</p>
        </div>
      </div>
    </div>
  )
}

export default OwnerDashboard 