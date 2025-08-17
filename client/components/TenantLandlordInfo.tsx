import { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

interface LandlordInfo {
  id: number
  name: string
  email: string
  phone?: string
  profile_photo?: string
  address?: string
  city?: string
  state?: string
}

interface PropertyInfo {
  id: number
  address: string
  unit?: string
  rent_amount: number
  due_date: number
  lease_start: string
  lease_end: string
  landlord: LandlordInfo
}

function TenantLandlordInfo() {
  const { user } = useAuth0()
  const [propertyInfo, setPropertyInfo] = useState<PropertyInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPropertyInfo()
  }, [])

  const fetchPropertyInfo = async () => {
    try {
      // TODO: Replace with actual API call
      const mockPropertyInfo: PropertyInfo = {
        id: 1,
        address: '123 Main St',
        unit: 'Apt 2B',
        rent_amount: 1200,
        due_date: 15, // Day of month
        lease_start: '2023-01-01',
        lease_end: '2024-12-31',
        landlord: {
          id: 1,
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          phone: '+1 (555) 123-4567',
          profile_photo: '/uploads/profiles/sarah.jpg',
          address: '456 Oak Ave',
          city: 'New York',
          state: 'NY'
        }
      }
      setPropertyInfo(mockPropertyInfo)
    } catch (error) {
      console.error('Error fetching property info:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!propertyInfo) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">My Property</h2>
          <div className="text-center text-gray-500">
            <p>No property information found.</p>
            <p className="text-sm">Please contact your landlord to get set up.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Property & Landlord</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Property Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Property Details</h3>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900">{propertyInfo.address}</h4>
                {propertyInfo.unit && (
                  <p className="text-gray-600">{propertyInfo.unit}</p>
                )}
                <p className="text-2xl font-bold text-blue-600 mt-2">
                  ${propertyInfo.rent_amount}/month
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Due on the {propertyInfo.due_date}{getDaySuffix(propertyInfo.due_date)} of each month
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Lease Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lease Start:</span>
                    <span>{new Date(propertyInfo.lease_start).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lease End:</span>
                    <span>{new Date(propertyInfo.lease_end).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Days Remaining:</span>
                    <span>{getDaysRemaining(propertyInfo.lease_end)} days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Landlord Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">My Landlord</h3>
            <div className="border rounded-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                {propertyInfo.landlord.profile_photo ? (
                  <img 
                    src={propertyInfo.landlord.profile_photo} 
                    alt="Landlord" 
                    className="w-16 h-16 rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <div>
                  <h4 className="text-xl font-semibold">{propertyInfo.landlord.name}</h4>
                  <p className="text-gray-600">Property Owner</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="text-gray-600">{propertyInfo.landlord.email}</span>
                </div>

                {propertyInfo.landlord.phone && (
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span className="text-gray-600">{propertyInfo.landlord.phone}</span>
                  </div>
                )}

                {propertyInfo.landlord.address && (
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">
                      {propertyInfo.landlord.address}, {propertyInfo.landlord.city}, {propertyInfo.landlord.state}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-2">
                <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                  Message Landlord
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50">
                  View Lease Agreement
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper functions
function getDaySuffix(day: number): string {
  if (day >= 11 && day <= 13) return 'th'
  switch (day % 10) {
    case 1: return 'st'
    case 2: return 'nd'
    case 3: return 'rd'
    default: return 'th'
  }
}

function getDaysRemaining(endDate: string): number {
  const end = new Date(endDate)
  const today = new Date()
  const diffTime = end.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}

export default TenantLandlordInfo 