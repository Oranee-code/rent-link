export interface Message {
  id: number
  senderId: number
  receiverId: number
  propertyId: number
  content: string
  messageType: 'text' | 'image' | 'document'
  isRead: boolean
  createdAt: Date
  updatedAt: Date
}

export interface MessageData {
  senderId: number
  receiverId: number
  propertyId: number
  content: string
  messageType: 'text' | 'image' | 'document'
} 