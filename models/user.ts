export interface User {
  id: number
  email: string
  name: string
  role: 'tenant' | 'landlord'
  phone?: string
  auth0Id: string
  createdAt: Date
  updatedAt: Date
}

export interface UserData {
  email: string
  name: string
  role: 'tenant' | 'landlord'
  phone?: string
  auth0Id: string
} 