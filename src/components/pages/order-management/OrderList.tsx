import { Card, CardContent } from "@/components/ui/card";
import { UserRole } from "../../../pages/Index";
import { OrderCard } from "./OrderCard";
import { getStatusOptions } from "./OrderStatusUtils";

interface OrderListProps {
  orders: any[];
  userRole: UserRole;
  expandedOrders: string[];
  editingOrder: string | null;
  toggleOrderExpansion: (orderId: string) => void;
  setEditingOrder: (orderId: string | null) => void;
  handleStatusChange: (orderId: string, newStatus: string) => void;
  removeItemFromOrder: (orderId: string, itemIndex: number) => void;
}

export const OrderList = ({
  orders,
  userRole,
  expandedOrders,
  editingOrder,
  toggleOrderExpansion,
  setEditingOrder,
  handleStatusChange,
  removeItemFromOrder
}: OrderListProps) => {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          userRole={userRole}
          expandedOrders={expandedOrders}
          editingOrder={editingOrder}
          toggleOrderExpansion={toggleOrderExpansion}
          setEditingOrder={setEditingOrder}
          getStatusOptions={getStatusOptions}
          handleStatusChange={handleStatusChange}
          removeItemFromOrder={removeItemFromOrder}
        />
      ))}

      {orders.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">No orders found matching the criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};