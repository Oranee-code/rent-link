import { useState } from 'react'

interface PaymentUploadProps {
  paymentId: number
  paymentType: string
  amount: number
  onClose: () => void
  onSubmit: (paymentId: number, proofFile: File) => void
}

function PaymentUpload({ paymentId, paymentType, amount, onClose, onSubmit }: PaymentUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) return

    setIsUploading(true)
    try {
      await onSubmit(paymentId, selectedFile)
      onClose()
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Upload Proof of Payment</h3>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Payment: {paymentType} - ${amount}
          </p>
          <p className="text-sm text-gray-500">
            Upload a photo or PDF of your bank transfer receipt, cash payment receipt, or any proof of payment.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proof of Payment
            </label>
            <input
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Accepted formats: JPG, PNG, PDF, DOC (Max 10MB)
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
              Cancel
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
    </div>
  )
}

export default PaymentUpload 