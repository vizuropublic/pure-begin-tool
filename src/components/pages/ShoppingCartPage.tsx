
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { Trash2, ShoppingBag } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const ShoppingCartPage = () => {
  const { cartItems, removeFromCart, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [isConfirmingOrder, setIsConfirmingOrder] = useState(false);

  console.log("🛒 Cart Items in ShoppingCartPage:", cartItems);
  console.log("🛒 Cart Items length:", cartItems.length);
  console.log("🛒 Total price:", getTotalPrice());

  const handleConfirmOrder = async () => {
    setIsConfirmingOrder(true);

    try {
      // Mock order creation
      clearCart();

      toast({
        title: "Order Confirmed",
        description: "Your order has been successfully placed (demo mode).",
        action: (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => {
              const event = new CustomEvent('navigateTo', { detail: 'order-management' });
              window.dispatchEvent(event);
            }}
          >
            Go to Orders
          </Button>
        ),
      });

    } catch (error: any) {
      console.error("❌ Error confirming order:", error);
      toast({
        title: "Order Error",
        description: error.message || "There was an error processing your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsConfirmingOrder(false);
    }
  };

  const handleBackToProductList = () => {
    // Trigger navigation to Product List page
    const event = new CustomEvent('navigateTo', { detail: 'product-list' });
    window.dispatchEvent(event);
  };

  // Ensure cartItems is an array and each item has required properties
  const safeCartItems = Array.isArray(cartItems) ? cartItems.filter(item => 
    item && 
    typeof item === 'object' && 
    item.id !== undefined && 
    item.name && 
    item.productId && 
    item.type && 
    item.price
  ) : [];

  console.log("✅ Safe cart items:", safeCartItems);

  return (
    <div className="space-y-content">
      <PageHeader
        title="Shopping Cart"
        description="View and manage your cart items"
      >
        <Badge variant="secondary" className="text-sm px-3 py-1">
          {safeCartItems.length} Items
        </Badge>
      </PageHeader>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Cart Items */}
        <div className="xl:col-span-2 space-y-4">
          {safeCartItems.length === 0 ? (
            <Card>
              <CardContent className="p-8 sm:p-12 text-center">
                <ShoppingBag className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-base sm:text-lg">Your cart is empty</p>
                <p className="text-muted-foreground/70 mt-2 text-sm sm:text-base">Start adding some products!</p>
              </CardContent>
            </Card>
          ) : (
            safeCartItems.map((item) => {
              // Ensure all required properties exist with fallbacks
              const itemId = item.id || 0;
              const itemName = String(item.name || 'Unknown Product');
              const itemType = String(item.type || 'Unknown Type');
              const itemProductId = String(item.productId || 'Unknown ID');
              const itemPrice = String(item.price || '$0');
              const itemLocation = String(item.location || 'Unknown Location');
              const itemImage = item.image || "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400";
              const itemQuantity = Number(item.quantity) || 1;

              console.log(`🔍 Rendering cart item:`, {
                id: itemId,
                name: itemName,
                type: itemType,
                productId: itemProductId,
                price: itemPrice,
                location: itemLocation
              });

              return (
                <Card key={itemId}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                      {/* Product Image */}
                      <div className="w-full sm:w-16 md:w-20 h-40 sm:h-16 md:h-20 flex-shrink-0">
                        <img 
                          src={itemImage}
                          alt={itemName}
                          className="w-full h-full object-cover rounded-lg border"
                        />
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base sm:text-lg text-card-foreground truncate">{itemName}</h3>
                        <p className="text-muted-foreground text-sm mt-1 truncate">{itemType}</p>
                        <p className="text-muted-foreground text-xs mt-1">ID: {itemProductId}</p>
                        <div className="text-xs text-muted-foreground mt-1">
                          <div className="truncate">Location: {itemLocation}</div>
                        </div>
                        <p className="text-primary font-bold text-lg sm:text-xl mt-2">
                          {itemPrice}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end space-x-4 sm:flex-col sm:space-x-0 sm:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-4">
                        {/* Quantity Display (Fixed at 1) */}
                        <div className="flex items-center">
                          <span className="font-medium px-3 py-1 bg-muted rounded text-sm">
                            {itemQuantity}
                          </span>
                        </div>
                        
                        {/* Remove Button */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:border-destructive/20 hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove "{itemName}" from your cart? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => removeFromCart(itemId)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t flex justify-between items-center">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-bold text-lg text-card-foreground">
                        {itemPrice}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-card-foreground">Subtotal</span>
                <span className="text-card-foreground">USD {getTotalPrice().toLocaleString()}</span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between text-lg font-bold">
                <span className="text-card-foreground">Total</span>
                <span className="text-primary">
                  USD {getTotalPrice().toLocaleString()}
                </span>
              </div>
              
              <Button 
                className="w-full h-12"
                disabled={safeCartItems.length === 0}
                onClick={handleConfirmOrder}
              >
                Confirm Order
              </Button>
              
              <Button variant="outline" className="w-full" onClick={handleBackToProductList}>
                Back to Product List
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartPage;
