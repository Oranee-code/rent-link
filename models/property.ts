export interface Property {
  id: number
  address: string
  unit?: string
  landlordId: number
  tenantId?: number
  rentAmount: number
  dueDate: number // Day of month
  electricIncluded: boolean
  waterIncluded: boolean
  internetIncluded: boolean
  createdAt: Date
  updatedAt: Date
}

export interface PropertyData {
  address: string
  unit?: string
  landlordId: number
  tenantId?: number
  rentAmount: number
  dueDate: number
  electricIncluded: boolean
  waterIncluded: boolean
  internetIncluded: boolean
} 