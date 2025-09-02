export interface MaintenanceRequest {
  id: number
  propertyId: number
  tenantId: number
  landlordId: number
  title: string
  description: string
  priority: 'low' | 'medium' |'urgent'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  category: 'plumbing' | 'electrical' | 'appliance' | 'structural' | 'other'
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
}

export interface MaintenanceData {
  propertyId: number
  tenantId: number
  landlordId: number
  title: string
  description: string
  priority: 'low' | 'medium' | 'urgent'
  category: 'plumbing' | 'electrical' | 'appliance' | 'structural' | 'other'
} 