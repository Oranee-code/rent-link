import { useState } from 'react'

interface BankDetailsProps {
  onClose: () => void
  paymentType: string
  amount: number
  dueDate: string
}

function BankDetails({ onClose, paymentType, amount, dueDate }: BankDetailsProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  // Mock bank details - in real app, this would come from landlord's profile
  const bankDetails = {
    accountName: 'Sarah Johnson Property Management',
    accountNumber: '1234 5678 9012 3456',
    bankName: 'ANZ Bank',
    bsb: '012-345',
    swiftCode: 'ANZBAU3M',
    reference: `RENT-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUploadProof = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) return

    setIsUploading(true)
    try {
      // TODO: Implement actual file upload to server
      const formData = new FormData()
      formData.append('proof', selectedFile)
      formData.append('paymentType', paymentType)
      formData.append('amount', amount.toString())
      formData.append('dueDate', dueDate)

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setUploadSuccess(true)
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Bank Transfer Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {uploadSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-green-800 mb-2">Proof Uploaded Successfully!</h4>
            <p className="text-gray-600">Your payment proof has been submitted to your landlord.</p>
          </div>
        ) : (
          <>
            {/* Payment Summary */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h4 className="font-semibold text-blue-900 mb-2">Payment Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Type:</span>
                  <span className="ml-2 capitalize">{paymentType}</span>
                </div>
                <div>
                  <span className="text-blue-700">Amount:</span>
                  <span className="ml-2 font-semibold">${amount}</span>
                </div>
                <div>
                  <span className="text-blue-700">Due Date:</span>
                  <span className="ml-2">{dueDate}</span>
                </div>
                <div>
                  <span className="text-blue-700">Reference:</span>
                  <span className="ml-2 font-mono text-xs">{bankDetails.reference}</span>
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="mb-6">
              <h4 className="font-semibold mb-4">Bank Transfer Details</h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Account Name:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{bankDetails.accountName}</span>
                    <button
                      onClick={() => copyToClipboard(bankDetails.accountName)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Copy to clipboard"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Bank Name:</span>
                  <span className="font-medium">{bankDetails.bankName}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">BSB:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium">{bankDetails.bsb}</span>
                    <button
                      onClick={() => copyToClipboard(bankDetails.bsb)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Copy to clipboard"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Account Number:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium">{bankDetails.accountNumber}</span>
                    <button
                      onClick={() => copyToClipboard(bankDetails.accountNumber)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Copy to clipboard"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Reference:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium text-sm">{bankDetails.reference}</span>
                    <button
                      onClick={() => copyToClipboard(bankDetails.reference)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Copy to clipboard"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
              <h5 className="font-semibold text-yellow-800 mb-2">Important Notes:</h5>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Please use the exact reference number when making the transfer</li>
                <li>• Transfers may take 1-2 business days to process</li>
                <li>• Keep your transfer receipt for proof of payment</li>
                <li>• Upload proof of transfer below once completed</li>
              </ul>
            </div>

            {/* Proof Upload */}
            <div className="mb-6">
              <h4 className="font-semibold mb-4">Upload Proof of Transfer</h4>
              <form onSubmit={handleUploadProof}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transfer Receipt/Screenshot
                  </label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload a screenshot or PDF of your bank transfer confirmation
                  </p>
                </div>

                {selectedFile && (
                  <div className="mb-4 p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium">Selected file:</p>
                    <p className="text-sm text-gray-600">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">
                      Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedFile || isUploading}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? 'Uploading...' : 'Upload Proof'}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default BankDetails
