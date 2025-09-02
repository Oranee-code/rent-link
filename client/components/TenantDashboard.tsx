import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import BankDetails from './BankDetails.tsx'

function TenantDashboard() {
  const { user } = useAuth0()
  const [activeTab, setActiveTab] = useState<'payments' | 'maintenance' | 'messages' | 'property'>('payments')
  const [showBankDetails, setShowBankDetails] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<{id: number, type: string, amount: number, dueDate: string} | null>(null)

  const mockProperty = {
    id: 1,
    address: '123 Main St',
    unit: 'Apt 2B',
    rentAmount: 1200,
    landlordName: 'Sarah Johnson',
    landlordEmail: 'sarah@example.com',
    leaseStart: '2023-01-01',
    leaseEnd: '2024-12-31',
    utilities: ['electric', 'water'],
    amenities: ['parking', 'laundry', 'gym']
  }

  const mockPayments = [
    {
      id: 1,
      type: 'rent',
      amount: 1200,
      dueDate: '2024-01-15',
      status: 'pending',
      description: 'Monthly rent',
      proofOfPayment: null,
      landlordVerified: false
    },
    {
      id: 2,
      type: 'electric',
      amount: 85,
      dueDate: '2024-01-20',
      status: 'paid',
      description: 'Electric bill',
      proofOfPayment: '/uploads/receipt-2.pdf',
      landlordVerified: true
    },
    {
      id: 3,
      type: 'water',
      amount: 45,
      dueDate: '2024-01-25',
      status: 'paid',
      description: 'Water bill',
      proofOfPayment: '/uploads/receipt-3.jpg',
      landlordVerified: false
    }
  ]

  const mockMaintenance = [
    {
      id: 1,
      title: 'Leaky Faucet',
      description: 'Kitchen faucet is dripping constantly',
      priority: 'medium',
      status: 'pending',
      category: 'plumbing',
      createdAt: '2024-01-10',
      landlordResponse: null
    },
    {
      id: 2,
      title: 'Broken Window',
      description: 'Window in bedroom won\'t close properly',
      priority: 'high',
      status: 'in_progress',
      category: 'structural',
      createdAt: '2024-01-05',
      landlordResponse: 'Scheduled for repair on Jan 15th'
    }
  ]

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Welcome back, {user?.name}!
            </h2>
            <p className="text-gray-600">Tenant Dashboard</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Today</p>
            <p className="text-lg font-semibold">{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-600">Monthly Rent</h3>
            <p className="text-2xl font-bold text-blue-900">${mockProperty.rentAmount}</p>
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
              onClick={() => setActiveTab('property')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'property'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Property
            </button>

          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-96">
          {activeTab === 'payments' && (
            <PaymentsTab 
              payments={mockPayments}
              onUploadProof={(payment) => {
                setSelectedPayment({
                  id: payment.id,
                  type: payment.type,
                  amount: payment.amount,
                  dueDate: payment.dueDate
                })
                setShowBankDetails(true)
              }}
            />
          )}
          {activeTab === 'maintenance' && <MaintenanceTab maintenance={mockMaintenance} />}
          {activeTab === 'messages' && <MessagesTab />}
          {activeTab === 'property' && <PropertyTab property={mockProperty} />}

        </div>

        {/* Bank Details Modal */}
        {showBankDetails && selectedPayment && (
          <BankDetails
            paymentType={selectedPayment.type}
            amount={selectedPayment.amount}
            dueDate={selectedPayment.dueDate}
            onClose={() => {
              setShowBankDetails(false)
              setSelectedPayment(null)
            }}
          />
        )}
      </div>
    </div>
  )
}

function PaymentsTab({ 
  payments, 
  onUploadProof 
}: { 
  payments: any[]
  onUploadProof: (payment: {id: number, type: string, amount: number, dueDate: string}) => void
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Payment Overview</h3>
        <div className="flex gap-2">
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => {
              const pendingPayment = payments.find(p => p.status === 'pending')
              if (pendingPayment) {
                onUploadProof({
                  id: pendingPayment.id,
                  type: pendingPayment.type,
                  amount: pendingPayment.amount,
                  dueDate: pendingPayment.dueDate
                })
              }
            }}
          >
            View Bank Details
          </button>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
            Request Extension
          </button>
        </div>
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
                  {payment.landlordVerified && (
                    <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{payment.description}</p>
                <p className="text-sm text-gray-500">Due: {payment.dueDate}</p>
                {payment.proofOfPayment && (
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
                {payment.status === 'pending' && (
                  <button 
                    className="text-sm text-blue-600 hover:underline mt-1"
                    onClick={() => onUploadProof({
                      id: payment.id,
                      type: payment.type,
                      amount: payment.amount,
                      dueDate: payment.dueDate
                    })}
                  >
                    View Bank Details
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
        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          New Request
        </button>
      </div>
      
      <div className="grid gap-4">
        {maintenance.map((request) => (
          <div key={request.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium">{request.title}</h4>
                <p className="text-sm text-gray-600">{request.description}</p>
                <p className="text-sm text-gray-500 capitalize">Category: {request.category}</p>
                <p className="text-sm text-gray-500">Created: {request.createdAt}</p>
                {request.landlordResponse && (
                  <div className="mt-2 p-2 bg-blue-50 rounded">
                    <p className="text-sm font-medium text-blue-800">Landlord Response:</p>
                    <p className="text-sm text-blue-600">{request.landlordResponse}</p>
                  </div>
                )}
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
                  <button className="text-sm text-red-600 hover:underline">Cancel</button>
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
          <p className="text-sm">You'll be able to message your landlord here.</p>
        </div>
      </div>
    </div>
  )
}

function PropertyTab({ property }: { property: any }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">My Property</h3>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          View Lease
        </button>
      </div>
      
      <div className="grid gap-6">
        {/* Property Details */}
        <div className="border rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-4">Property Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-medium">{property.address}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Unit</p>
              <p className="font-medium">{property.unit}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Monthly Rent</p>
              <p className="font-medium">${property.rentAmount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Lease Period</p>
              <p className="font-medium">{property.leaseStart} to {property.leaseEnd}</p>
            </div>
          </div>
        </div>

        {/* Landlord Contact */}
        <div className="border rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-4">Landlord Contact</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">{property.landlordName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{property.landlordEmail}</p>
            </div>
          </div>
        </div>

        {/* Utilities & Amenities */}
        <div className="border rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-4">Utilities & Amenities</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">Utilities Included</p>
              <div className="flex flex-wrap gap-2">
                {property.utilities.map((utility: string) => (
                  <span key={utility} className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                    {utility}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Amenities</p>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity: string) => (
                  <span key={amenity} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TenantDashboard 