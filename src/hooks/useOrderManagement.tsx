import { useState } from "react";
import { useNotifications } from "../contexts/NotificationContext";
import { useToast } from "@/hooks/use-toast";
import { mockOrders, mockOrderItems } from "@/data/mockOrders";
import { mockInventory } from "@/data/mockInventory";

export interface InventoryItem {
  id: string;
  name: string;
  status: "available" | "listed" | "ordered" | "sold" | "deleted";
  type: string;
  make: string | null;
  family: string;
  est_price: number;
  location: string;
  source: string;
  seller_id: string | null;
  created_at: string;
  updated_at: string;
  comment: string | null;
  remark: string | null;
  possibility: string;
  inventory_photo: Array<{
    id: number;
    file_path: string;
    is_primary: boolean;
    inventory_id: string;
  }>;
  subcategory: string | null;
}

export interface OrderItem {
  id: string;
  order_id: string;
  inventory_id: string;
  quantity: number;
  unit_price: number;
  inventory: InventoryItem;
}

export interface Order {
  id: string;
  order_number: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  ordering_staff: {
    name: string;
    email: string;
  };
  seller_id: {
    name: string;
    email: string;
  } | null;
  ordering_time: string;
  update_time: string;
  items_number: number;
  total_quantity: number;
  total_amount: number;
  cancellation_reason: string[] | null;
  delivery_name: string;
  delivery_address: string;
  order_items: OrderItem[];
}

export const useOrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders.map(order => ({
    ...order,
    status: order.status as "Pending" | "Confirmed" | "Completed" | "Cancelled",
    ordering_staff: { name: 'Demo User', email: 'demo@example.com' },
    seller_id: null,
    ordering_time: order.created_at,
    update_time: order.updated_at,
    items_number: 1,
    total_quantity: 1,
    delivery_name: 'Demo Recipient',
    delivery_address: '123 Demo Street',
    order_items: mockOrderItems
      .filter(item => item.order_id === order.id)
      .map(item => ({
        ...item,
        inventory: mockInventory.find(inv => inv.id === item.inventory_id)!,
      })),
  })));
  const [loading] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{orderId: string, newStatus: "Pending" | "Confirmed" | "Completed" | "Cancelled"} | null>(null);
  const [isCancellationDialogOpen, setIsCancellationDialogOpen] = useState(false);
  const [cancellationReasons, setCancellationReasons] = useState<string[]>([]);
  const [customCancellationReason, setCustomCancellationReason] = useState("");
  const { addNotification } = useNotifications();
  const { toast } = useToast();

  const clearAllOrders = async () => {
    setOrders([]);
    addNotification({
      type: 'general',
      title: 'Data Cleared',
      content: 'All orders have been cleared.',
      isRead: false,
    });
    toast({ title: "Success", description: "All order data has been cleared." });
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleStatusChange = (orderId: string, newStatus: "Pending" | "Confirmed" | "Completed" | "Cancelled") => {
    setPendingStatusChange({ orderId, newStatus });
    if (newStatus === "Cancelled") {
      setCancellationReasons([]);
      setCustomCancellationReason("");
      setIsCancellationDialogOpen(true);
    } else {
      setIsStatusDialogOpen(true);
    }
  };

  const confirmStatusChange = async () => {
    if (!pendingStatusChange) return;
    const { orderId, newStatus } = pendingStatusChange;
    
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    
    addNotification({
      type: 'order_updated',
      title: 'Order Status Updated',
      content: `Order status updated to ${newStatus}`,
      isRead: false,
      orderId: orderId,
    });

    setIsStatusDialogOpen(false);
    setPendingStatusChange(null);
  };

  const confirmCancellation = async () => {
    if (!pendingStatusChange) return;
    const { orderId, newStatus } = pendingStatusChange;
    const finalReasons = cancellationReasons.length > 0 ? cancellationReasons : (customCancellationReason ? [customCancellationReason] : []);
    
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus, cancellation_reason: finalReasons } : o));
    
    addNotification({
      type: 'order_updated',
      title: 'Order Cancelled',
      content: `Order has been cancelled.`,
      isRead: false,
      orderId: orderId,
    });

    setIsCancellationDialogOpen(false);
    setPendingStatusChange(null);
    setCancellationReasons([]);
    setCustomCancellationReason("");
  };

  const removeItemFromOrder = async (orderId: string, itemIndex: number) => {
    const order = orders.find(o => o.id === orderId);
    if (!order || !order.order_items?.[itemIndex]) return;

    const updatedOrders = orders.map(o => {
      if (o.id === orderId) {
        const remainingItems = o.order_items.filter((_, idx) => idx !== itemIndex);
        const newTotalAmount = remainingItems.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
        const newTotalQuantity = remainingItems.reduce((sum, item) => sum + item.quantity, 0);
        return {
          ...o,
          order_items: remainingItems,
          total_amount: newTotalAmount,
          total_quantity: newTotalQuantity,
          items_number: remainingItems.length,
        };
      }
      return o;
    });
    
    setOrders(updatedOrders);
    toast({ title: "Success", description: "Item removed from order." });
  };

  return {
    orders,
    loading,
    expandedOrders,
    editingOrder,
    isStatusDialogOpen,
    pendingStatusChange,
    isCancellationDialogOpen,
    cancellationReasons,
    customCancellationReason,
    setEditingOrder,
    setIsStatusDialogOpen,
    setPendingStatusChange,
    setIsCancellationDialogOpen,
    setCancellationReasons,
    setCustomCancellationReason,
    clearAllOrders,
    toggleOrderExpansion,
    handleStatusChange,
    confirmStatusChange,
    confirmCancellation,
    removeItemFromOrder
  };
};
