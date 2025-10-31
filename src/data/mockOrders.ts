export const mockOrders = [
  {
    id: "order-1",
    order_number: "ORD-00001",
    buyer_id: "user-1",
    seller_id: null,
    total_amount: 150000,
    status: "Pending",
    created_at: "2024-03-15T09:00:00Z",
    updated_at: "2024-03-15T09:00:00Z",
    created_by: "user-1",
    cancellation_reason: null,
  },
  {
    id: "order-2",
    order_number: "ORD-00002",
    buyer_id: "user-1",
    seller_id: null,
    total_amount: 35000,
    status: "Confirmed",
    created_at: "2024-03-10T14:00:00Z",
    updated_at: "2024-03-12T10:00:00Z",
    created_by: "user-1",
    cancellation_reason: null,
  },
];

export const mockOrderItems = [
  {
    id: "item-1",
    order_id: "order-1",
    inventory_id: "inv-1",
    quantity: 1,
    unit_price: 150000,
    created_at: "2024-03-15T09:00:00Z",
  },
  {
    id: "item-2",
    order_id: "order-2",
    inventory_id: "inv-2",
    quantity: 1,
    unit_price: 35000,
    created_at: "2024-03-10T14:00:00Z",
  },
];
