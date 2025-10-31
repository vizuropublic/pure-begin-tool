import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { TrendingUp, Package } from "lucide-react";
import { InventoryFilters } from "./InventoryFilters";
import { InventoryActionBar } from "./InventoryActionBar";
import { InventoryTable } from "./InventoryTable";
import { InventoryPagination } from "./InventoryPagination";
import { UserRole } from "../../pages/Index";
import { useInventory } from "@/hooks/useInventory";
import { PageHeader } from "../ui/page-header";

interface ProductListPageProps {
  userRole: UserRole;
}

const ProductListPage = ({ userRole }: ProductListPageProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterPossibility, setFilterPossibility] = useState<string>("all");
  const [filterLocation, setFilterLocation] = useState<string>("all");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { toast } = useToast();
  const { addToCart, cartItems } = useCart();
  const { inventory, loading, updateInventoryStatus } = useInventory();

  // Debug: Log user role and data loading status
  useEffect(() => {
    console.log("🔍 ProductListPage Debug Info:");
    console.log("👤 Current User Role:", userRole);
    console.log("📦 Total Inventory Items:", inventory.length);
    console.log("🛒 Cart Items Count:", cartItems.length);
    console.log("🛒 Cart Item IDs:", cartItems.map(item => item.id));
    
    // Log inventory status breakdown
    const statusBreakdown = inventory.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    console.log("📊 Inventory Status Breakdown:", statusBreakdown);
    
    // Log available products specifically
    const availableProducts = inventory.filter(item => item.status === "available");
    console.log("✅ Available Products:", availableProducts.length);
    console.log("📋 Available Product Names:", availableProducts.map(p => p.name));
  }, [userRole, inventory, cartItems]);

  const filteredInventory = inventory.filter(item => {
    // Debug: Log each step of filtering for available products
    const isAvailable = item.status === "available";
    if (isAvailable) {
      console.log(`🔍 Filtering available product: ${item.name} (${item.id})`);
    }

    // Remove products with "Ordered" status from product list completely
    if (item.status === "ordered") {
      if (isAvailable) console.log(`❌ Filtered out by ordered status: ${item.name}`);
      return false;
    }

    // Hide products that are already in cart
    if (cartItems.some(cartItem => cartItem.id.toString() === item.id)) {
      if (isAvailable) console.log(`🛒 Filtered out by cart: ${item.name}`);
      return false;
    }

    // For Remanufacturer Admin and Remanufacturer Agent roles, only show Listed products
    if (userRole === "Remanufacturer Admin" || userRole === "Remanufacturer Agent") {
      if (item.status !== "listed") {
        if (isAvailable) console.log(`👤 Filtered out by role restriction: ${item.name}`);
        return false;
      }
    }

    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || item.type === filterType;
    const matchesPossibility = filterPossibility === "all" || item.possibility === filterPossibility;
    const matchesLocation = filterLocation === "all" || item.location === filterLocation;
    const matchesAgent = filterSource === "all" || item.source === filterSource;

    const passesAllFilters = matchesSearch && matchesType && matchesPossibility && 
                            matchesLocation && matchesAgent;

    if (isAvailable && !passesAllFilters) {
      console.log(`🔧 Available product filtered by search/filters: ${item.name}`, {
        matchesSearch,
        matchesType,
        matchesPossibility, 
        matchesLocation,
        matchesAgent,
        searchTerm,
        filterType,
        filterPossibility,
        filterLocation,
        filterSource
      });
    }

    if (isAvailable && passesAllFilters) {
      console.log(`✅ Available product passed all filters: ${item.name}`);
    }

    return passesAllFilters;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);
  const paginatedInventory = filteredInventory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page
  };
  // Debug: Log final filtering results
  useEffect(() => {
    const availableInFiltered = filteredInventory.filter(item => item.status === "available");
    console.log(`📊 Final Results - Available products shown: ${availableInFiltered.length}/${inventory.filter(item => item.status === "available").length}`);
    console.log(`📋 Available products in final list:`, availableInFiltered.map(p => p.name));
  }, [filteredInventory, inventory]);

  const handleSelectItem = (itemId: string, checked: boolean) => {
    setSelectedItems(prev => 
      checked ? [...prev, itemId] : prev.filter(id => id !== itemId)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? filteredInventory.map(item => item.id) : []);
  };

  // Check if selected items can be listed/unlisted (exclude Ordered items)
  const canListItems = () => {
    const selectedInventory = inventory.filter(item => selectedItems.includes(item.id));
    return selectedInventory.every(item => item.status !== "ordered");
  };

  const handleListItems = async () => {
    if (!canListItems()) {
      toast({
        title: "Cannot List Products",
        description: "Products with 'ordered' status cannot be listed.",
        variant: "destructive"
      });
      return;
    }
    
    const success = await updateInventoryStatus(selectedItems, "listed");
    if (success) {
      toast({
        title: "Products Listed",
        description: `${selectedItems.length} product(s) have been listed successfully.`,
      });
      setSelectedItems([]);
    }
  };

  const handleUnlistItems = async () => {
    if (!canListItems()) {
      toast({
        title: "Cannot Unlist Products",
        description: "Products with 'ordered' status cannot be unlisted.",
        variant: "destructive"
      });
      return;
    }
    
    const success = await updateInventoryStatus(selectedItems, "available");
    if (success) {
      toast({
        title: "Products Unlisted",
        description: `${selectedItems.length} product(s) have been unlisted successfully.`,
      });
      setSelectedItems([]);
    }
  };

  const handleSetAsDefault = () => {
    setFilterType("all");
    setFilterPossibility("all");
    setFilterLocation("all");
    setFilterSource("all");
    toast({
      title: "Filters Reset to Default",
      description: "All filters have been reset to default values.",
    });
  };

  const handleAddToCart = () => {
    const selectedInventory = inventory.filter(item => selectedItems.includes(item.id));
    
    selectedInventory.forEach(item => {
      addToCart({
        id: parseInt(item.id.slice(-8), 16), // Convert UUID to number for cart compatibility
        name: item.name,
        productId: item.id,
        type: item.type,
        price: item.price,
        image: item.image,
        location: item.location,
      });
    });
    
    toast({
      title: "Products Added to Cart",
      description: `${selectedItems.length} product(s) have been added to cart successfully.`,
    });
    setSelectedItems([]);
  };

  const listedItems = inventory.filter(item => item.status === "listed");
  const availableItems = inventory.filter(item => item.status === "available");
  const totalValue = inventory.reduce((sum, item) => sum + item.est_price, 0);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header Section - Fixed */}
      <div className="flex-shrink-0 space-y-4 sm:space-y-6 border-b border-border">
        <PageHeader
          title="Product List"
          description="Manage and view all product information"
        />

        {/* Action Bar */}
        <InventoryActionBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedItems={selectedItems}
          onListItems={handleListItems}
          onUnlistItems={handleUnlistItems}
          onAddToCart={handleAddToCart}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          userRole={userRole}
          showCartControls={true}
        />

        {/* Filters */}
        <InventoryFilters
          filterType={filterType}
          setFilterType={setFilterType}
          filterPossibility={filterPossibility}
          setFilterPossibility={setFilterPossibility}
          filterLocation={filterLocation}
          setFilterLocation={setFilterLocation}
          filterSource={filterSource}
          setFilterSource={setFilterSource}
          onSetAsDefault={handleSetAsDefault}
          isVisible={showFilters}
          inventory={inventory}
        />
      </div>

      {/* Content Section - Scrollable */}
      <div className="flex-1 min-h-0">
        {loading ? (
          <Card className="h-full">
            <CardContent className="p-8 sm:p-12 text-center h-full flex items-center justify-center">
              <p className="text-muted-foreground">Loading inventory...</p>
            </CardContent>
          </Card>
        ) : filteredInventory.length === 0 ? (
          <Card className="h-full">
            <CardContent className="p-8 sm:p-12 text-center h-full flex items-center justify-center">
              <p className="text-muted-foreground">No products found matching the criteria</p>
            </CardContent>
          </Card>
        ) : (
          <InventoryTable
            inventory={paginatedInventory}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onSelectAll={handleSelectAll}
            viewMode={viewMode}
            showAddToCart={true}
            showSource={false}
          />
        )}
      </div>

      {/* Footer Section - Fixed */}
      <div className="flex-shrink-0 pt-4 sm:pt-6 p-4 sm:p-6 border-t border-border bg-card">
        <InventoryPagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredInventory.length}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange} />
      </div>
    </div>
  );
};

export default ProductListPage;