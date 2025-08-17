export interface MaintenanceRequest {
  id: number
  propertyId: number
  tenantId: number
  landlordId: number
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  category: 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'structural' | 'other'
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
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'structural' | 'other'
} 