export interface Payment {
  id: number
  propertyId: number
  tenantId: number
  landlordId: number
  type: 'rent' | 'electric' | 'water' | 'internet' | 'other'
  amount: number
  dueDate: Date
  paidDate?: Date
  status: 'pending' | 'paid' | 'overdue' | 'extended' | 'verified'
  description?: string
  proofOfPayment?: string // URL to uploaded proof document
  landlordVerified?: boolean
  verificationDate?: Date
  createdAt: Date
  updatedAt: Date
}

export interface PaymentData {
  propertyId: number
  tenantId: number
  landlordId: number
  type: 'rent' | 'electric' | 'water' | 'internet' | 'other'
  amount: number
  dueDate: Date
  description?: string
} 