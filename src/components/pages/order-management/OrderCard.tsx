import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Download, Edit } from "lucide-react";
import { UserRole } from "../../../pages/Index";
import { OrderDetails } from "./OrderDetails";
import { OrderStatusProgress } from "./OrderStatusProgress";

interface OrderCardProps {
  order: any;
  userRole: UserRole;
  expandedOrders: string[];
  editingOrder: string | null;
  toggleOrderExpansion: (orderId: string) => void;
  setEditingOrder: (orderId: string | null) => void;
  getStatusOptions: (userRole: UserRole, currentStatus: string) => string[];
  handleStatusChange: (orderId: string, newStatus: string) => void;
  removeItemFromOrder: (orderId: string, itemIndex: number) => void;
}

export const OrderCard = ({ 
  order, 
  userRole, 
  expandedOrders, 
  editingOrder, 
  toggleOrderExpansion, 
  setEditingOrder, 
  getStatusOptions, 
  handleStatusChange, 
  removeItemFromOrder 
}: OrderCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <Collapsible>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-2">
                <h3 className="font-semibold text-lg">{order.order_number}</h3>
                <Badge 
                  className={
                    order.status === "Pending" ? "bg-yellow-500 hover:bg-yellow-600" :
                    order.status === "Confirmed" ? "bg-green-500 hover:bg-green-600" :
                    order.status === "Cancelled" ? "bg-gray-500 hover:bg-gray-600" :
                    order.status === "Completed" ? "bg-blue-500 hover:bg-blue-600" :
                    "bg-gray-500 hover:bg-gray-600"
                  }
                >
                  <Select 
                    value={order.status} 
                    onValueChange={(newStatus) => handleStatusChange(order.id, newStatus)}
                    disabled={getStatusOptions(userRole, order.status).length <= 1}
                  >
                    <SelectTrigger className="border-none bg-transparent p-0 h-auto font-normal">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getStatusOptions(userRole, order.status).map((status) => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-bold">Ordering Staff:</span><br />
                  <span className="ml-1">{order.ordering_staff?.name || 'Unknown Staff'}</span>
                </div>
                <div>
                  <span className="font-bold">Order Time:</span><br />
                  <span className="ml-1">{new Date(order.ordering_time).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="font-bold">Update Time:</span><br/>
                  {new Date(order.update_time).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-bold">Items:</span><br/>
                  {order.items_number} items
                </div>
                <div>
                  <span className="font-bold">Total Quantity:</span><br/>
                  {order.total_quantity || order.items} pieces
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end space-y-2">
              <div className="flex space-x-2">
                <CollapsibleTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => toggleOrderExpansion(order.id)}>
                    {expandedOrders.includes(order.id) ? (
                      <ChevronUp className="mr-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="mr-1 h-4 w-4" />
                    )}
                    Details
                  </Button>
                </CollapsibleTrigger>
                <Button variant="outline" size="sm">
                  <Download className="mr-1 h-4 w-4" />
                  Download
                </Button>
                {order.status === "Pending Confirmation" && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingOrder(editingOrder === order.id ? null : order.id)}
                  >
                    <Edit className="mr-1 h-4 w-4" />
                    Edit
                  </Button>
                )}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">
                  USD {order.total_amount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        
          <CollapsibleContent className="mt-4">
            <OrderStatusProgress 
              status={order.status} 
              cancellationReasons={order.cancellationReasons}
            />
            <OrderDetails 
              order={order} 
              editingOrder={editingOrder} 
              removeItemFromOrder={removeItemFromOrder} 
            />
          </CollapsibleContent>
        </CardContent>
      </Collapsible>
    </Card>
  );
};