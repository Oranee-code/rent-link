import { useAuth0 } from '@auth0/auth0-react'
import { useState } from 'react'
import PaymentUpload from './PaymentUpload.tsx'

interface User {
  id: number
  name: string
  role: 'tenant' | 'landlord'
  email: string
}

function Dashboard() {
  const { user } = useAuth0()
  const [activeTab, setActiveTab] = useState<'payments' | 'maintenance' | 'chat' | 'properties'>('payments')
  const [showPaymentUpload, setShowPaymentUpload] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<{id: number, type: string, amount: number} | null>(null)
  
  // Mock user data - in real app, this would come from your API
  const mockUser: User = {
    id: 1,
    name: user?.name || 'User',
    role: 'tenant', // This would be determined from your database
    email: user?.email || ''
  }

  const isTenant = mockUser.role === 'tenant'
  const isLandlord = mockUser.role === 'landlord'

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Welcome back, {mockUser.name}!
            </h2>
            <p className="text-gray-600 capitalize">
              {mockUser.role} Dashboard
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Today</p>
            <p className="text-lg font-semibold">{new Date().toLocaleDateString()}</p>
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
              onClick={() => setActiveTab('chat')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'chat'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Messages
            </button>
            {isLandlord && (
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
            )}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-96">
          {activeTab === 'payments' && (
            <PaymentsTab 
              isTenant={isTenant} 
              onUploadProof={(payment) => {
                setSelectedPayment(payment)
                setShowPaymentUpload(true)
              }}
            />
          )}
          {activeTab === 'maintenance' && <MaintenanceTab isTenant={isTenant} />}
          {activeTab === 'chat' && <ChatTab />}
          {activeTab === 'properties' && isLandlord && <PropertiesTab />}
        </div>

        {/* Payment Upload Modal */}
        {showPaymentUpload && selectedPayment && (
          <PaymentUpload
            paymentId={selectedPayment.id}
            paymentType={selectedPayment.type}
            amount={selectedPayment.amount}
            onClose={() => {
              setShowPaymentUpload(false)
              setSelectedPayment(null)
            }}
            onSubmit={async (paymentId, proofFile) => {
              // TODO: Implement file upload to server
              console.log('Uploading proof for payment:', paymentId, proofFile)
              // In real app, you would upload the file to your server
              // and update the payment record with the proof URL
            }}
          />
        )}
      </div>
    </div>
  )
}

function PaymentsTab({ 
  isTenant, 
  onUploadProof 
}: { 
  isTenant: boolean
  onUploadProof: (payment: {id: number, type: string, amount: number}) => void
}) {
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

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Payment Overview</h3>
        <div className="flex gap-2">
          {isTenant && (
            <>
              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => {
                  const pendingPayment = mockPayments.find(p => p.status === 'pending')
                  if (pendingPayment) {
                    onUploadProof({
                      id: pendingPayment.id,
                      type: pendingPayment.type,
                      amount: pendingPayment.amount
                    })
                  }
                }}
              >
                Upload Proof
              </button>
              <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                Request Extension
              </button>
            </>
          )}
          {!isTenant && (
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Verify Payment
            </button>
          )}
        </div>
      </div>
      
      <div className="grid gap-4">
        {mockPayments.map((payment) => (
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
                {isTenant && payment.status === 'pending' && (
                  <button className="text-sm text-blue-600 hover:underline mt-1">
                    Mark as Paid
                  </button>
                )}
                {!isTenant && payment.proofOfPayment && !payment.landlordVerified && (
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

function MaintenanceTab({ isTenant }: { isTenant: boolean }) {
  const mockRequests = [
    {
      id: 1,
      title: 'Leaky Faucet',
      description: 'Kitchen faucet is dripping constantly',
      priority: 'medium',
      status: 'pending',
      category: 'plumbing'
    }
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Maintenance Requests</h3>
        {isTenant && (
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            New Request
          </button>
        )}
      </div>
      
      <div className="grid gap-4">
        {mockRequests.map((request) => (
          <div key={request.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{request.title}</h4>
                <p className="text-sm text-gray-600">{request.description}</p>
                <p className="text-sm text-gray-500 capitalize">{request.category}</p>
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ChatTab() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Messages</h3>
      <div className="border rounded-lg p-4 h-96 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p>Chat functionality coming soon!</p>
          <p className="text-sm">You'll be able to message your landlord/tenant here.</p>
        </div>
      </div>
    </div>
  )
}

function PropertiesTab() {
  const mockProperties = [
    {
      id: 1,
      address: '123 Main St',
      unit: 'Apt 2B',
      rentAmount: 1200,
      tenantName: 'John Doe',
      status: 'occupied'
    }
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">My Properties</h3>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Property
        </button>
      </div>
      
      <div className="grid gap-4">
        {mockProperties.map((property) => (
          <div key={property.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">{property.address}</h4>
                <p className="text-sm text-gray-600">{property.unit}</p>
                <p className="text-sm text-gray-500">Tenant: {property.tenantName}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">${property.rentAmount}/month</p>
                <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                  {property.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard 