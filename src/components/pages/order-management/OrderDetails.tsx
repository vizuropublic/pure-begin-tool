import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

interface OrderDetailsProps {
  order: any;
  editingOrder: string | null;
  removeItemFromOrder: (orderId: string, itemIndex: number) => void;
}

export const OrderDetails = ({ order, editingOrder, removeItemFromOrder }: OrderDetailsProps) => {
  return (
    <div className="border-t pt-4">
      <h4 className="font-bold mb-3">Order Details</h4>
      {order.order_items && Array.isArray(order.order_items) && order.order_items.length > 0 ? (
        <div className="space-y-3">
          {order.order_items.map((item: any, index: number) => {
            // Safety check to ensure item is an object
            if (!item || typeof item !== 'object') {
              console.warn('Invalid item in orderDetails:', item);
              return null;
            }
            
            return (
              <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 flex-shrink-0">
                  <img 
                    src={item.inventory.inventory_photo?.[0]?.file_path || "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400"}
                    alt={item.inventory.name || 'Product'}
                    className="w-full h-full object-cover rounded-lg border"
                  />
                </div>
                <div className="flex-1">
                  <h5 className="font-medium">{item.inventory.name || 'Unknown Product'}</h5>
                  <p className="font-medium text-muted-foreground">Type: {item.inventory.type || 'Unknown Type'}</p>
                  <p className="font-medium text-muted-foreground">Make: {item.inventory.make || 'N/A'}</p>
                  <p className="font-medium text-muted-foreground">Family: {item.inventory.family || 'N/A'}</p>
                  <p className="font-medium text-muted-foreground">Subcategory: {item.inventory.subcategory || 'N/A'}</p>
                  <p className="font-medium text-muted-foreground">Location: {item.inventory.location || "--"}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">x {item.quantity || 0}</p>
                  <p className="text-lg text-blue-600 font-bold">{item.inventory.est_price || 'N/A'}</p>
                </div>
                {editingOrder === order.id && order.status === "Pending Confirmation" && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove "{item.inventory.name || 'this item'}" from the order? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => removeItemFromOrder(order.id, index)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No order details available</p>
      )}
    </div>
  );
};