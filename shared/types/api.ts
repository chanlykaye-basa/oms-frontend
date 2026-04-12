export type OrderStatus =
  | 'COLLECTED'
  | 'PENDING_REVIEW'
  | 'CONFIRMED'
  | 'PREPARING_SHIPMENT'
  | 'SHIPPING'
  | 'DELIVERED'
  | 'DELIVERY_ISSUE'
  | 'PURCHASE_CONFIRMED'
  | 'RETURNING'
  | 'RETURNED'
  | 'CANCELLED'

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  COLLECTED: '수집완료',
  PENDING_REVIEW: '확인대기',
  CONFIRMED: '주문확인',
  PREPARING_SHIPMENT: '배송준비',
  SHIPPING: '배송중',
  DELIVERED: '배송완료',
  DELIVERY_ISSUE: '배송이상',
  PURCHASE_CONFIRMED: '구매확정',
  RETURNING: '반품진행',
  RETURNED: '반품완료',
  CANCELLED: '주문취소',
}

export const ALLOWED_ACTIONS: Partial<Record<OrderStatus, string[]>> = {
  COLLECTED: ['confirm', 'cancel'],
  PENDING_REVIEW: ['confirm', 'reject', 'cancel'],
  CONFIRMED: ['prepareShipment', 'cancel'],
  PREPARING_SHIPMENT: ['addShipment', 'cancel'],
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface Address {
  name: string
  phone: string
  zipCode: string
  address1: string
  address2?: string
}

export interface Order {
  id: string
  orderNumber: string
  channelId: string
  channelName?: string
  status: OrderStatus
  ordererName: string
  ordererPhone: string
  recipientName: string
  recipientPhone: string
  recipientAddress: Address
  items: OrderItem[]
  totalAmount: number
  orderedAt: string
  createdAt: string
  updatedAt: string
}

export interface OrderListItem {
  id: string
  orderNumber: string
  channelId: string
  channelName?: string
  status: OrderStatus
  ordererName: string
  totalAmount: number
  orderedAt: string
}

export interface OrdersResponse {
  content: OrderListItem[]
  nextCursor?: string
  hasMore: boolean
}

export interface OrderHistory {
  id: string
  orderId: string
  fromStatus?: OrderStatus
  toStatus: OrderStatus
  reason?: string
  createdAt: string
}

export interface Shipment {
  id: string
  orderId: string
  carrierCode: string
  trackingNumber: string
  items: ShipmentItem[]
  createdAt: string
}

export interface ShipmentItem {
  orderItemId: string
  quantity: number
}

export interface DashboardSummary {
  statusCounts: Partial<Record<OrderStatus, number>>
  totalOrders: number
}

export interface CollectionJob {
  id: string
  channelId: string
  channelName?: string
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED'
  collectedCount?: number
  startedAt?: string
  completedAt?: string
  createdAt: string
}

export interface CollectionJobsResponse {
  content: CollectionJob[]
  nextCursor?: string
  hasMore: boolean
}
