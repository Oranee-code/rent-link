import { useState } from 'react'
import BankDetails from './BankDetails.tsx'

function PaymentTest() {
  const [showBankDetails, setShowBankDetails] = useState(false)

  const testPayment = {
    id: 1,
    type: 'rent',
    amount: 1200,
    dueDate: '2024-01-15',
    status: 'pending',
    description: 'Monthly rent'
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Test Page</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Test Payment</h3>
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium capitalize">{testPayment.type}</h4>
                  <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">
                    {testPayment.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{testPayment.description}</p>
                <p className="text-sm text-gray-500">Due: {testPayment.dueDate}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">${testPayment.amount}</p>
                <button 
                  className="text-sm text-blue-600 hover:underline mt-1"
                  onClick={() => setShowBankDetails(true)}
                >
                  View Bank Details
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Debug Information</h3>
          <div className="bg-gray-50 p-4 rounded">
            <p><strong>Payment Status:</strong> {testPayment.status}</p>
            <p><strong>Payment Type:</strong> {testPayment.type}</p>
            <p><strong>Amount:</strong> ${testPayment.amount}</p>
            <p><strong>Due Date:</strong> {testPayment.dueDate}</p>
            <p><strong>Button should show:</strong> {testPayment.status === 'pending' ? 'Yes' : 'No'}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => setShowBankDetails(true)}
          >
            Test Bank Details Modal
          </button>
          
          <a 
            href="/bank-details" 
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Direct Bank Details Page
          </a>
        </div>
      </div>

      {/* Bank Details Modal */}
      {showBankDetails && (
        <BankDetails
          paymentType={testPayment.type}
          amount={testPayment.amount}
          dueDate={testPayment.dueDate}
          onClose={() => setShowBankDetails(false)}
        />
      )}
    </div>
  )
}

export default PaymentTest
