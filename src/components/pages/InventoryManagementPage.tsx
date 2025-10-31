import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Package, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { InventoryFilters } from "./InventoryFilters";
import { InventoryActionBar } from "./InventoryActionBar";
import { InventoryTable } from "./InventoryTable";
import { useInventory } from "@/hooks/useInventory";
import { PageHeader } from "../ui/page-header";


const InventoryManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterPossibility, setFilterPossibility] = useState<string>("all");
  const [filterLocation, setFilterLocation] = useState<string>("all");
  
  const [filterSource, setFilterSource] = useState<string>("all");
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [sectionsExpanded, setSectionsExpanded] = useState({
    available: true,
    listed: true,
    ordered: true,
    sold: true
  });
  const { toast } = useToast();
  const { inventory, loading, updateInventoryStatus } = useInventory();

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || item.type === filterType;
    const matchesPossibility = filterPossibility === "all" || item.possibility === filterPossibility;
    const matchesLocation = filterLocation === "all" || item.location === filterLocation;
    const matchesSource = filterSource === "all" || item.source === filterSource;

    return matchesSearch && matchesType && matchesPossibility && 
           matchesLocation && matchesSource;
  });

  // Group items by status
  const availableItemsList = filteredInventory.filter(item => item.status === "available");
  const listedItemsList = filteredInventory.filter(item => item.status === "listed");
  const orderedItems = filteredInventory.filter(item => item.status === "ordered");
  const soldItems = filteredInventory.filter(item => item.status === "sold");

  // Get selected items for each section
  const selectedAvailableItems = selectedItems.filter(id => availableItemsList.some(item => item.id === id));
  const selectedListedItems = selectedItems.filter(id => listedItemsList.some(item => item.id === id));

  const handleSelectItem = (itemId: string, checked: boolean) => {
    // Don't allow selection of ordered or sold items
    const item = inventory.find(item => item.id === itemId);
    if (item && (item.status === "ordered" || item.status === "sold")) {
      return;
    }
    
    setSelectedItems(prev => 
      checked ? [...prev, itemId] : prev.filter(id => id !== itemId)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? filteredInventory.map(item => item.id) : []);
  };

  const handleSectionSelectAll = (sectionItems: any[], checked: boolean) => {
    const sectionItemIds = sectionItems.map(item => item.id);
    if (checked) {
      // Only select items from this section
      setSelectedItems(prev => [...new Set([...prev, ...sectionItemIds])]);
    } else {
      // Only deselect items from this section
      setSelectedItems(prev => prev.filter(id => !sectionItemIds.includes(id)));
    }
  };

  const toggleSection = (section: keyof typeof sectionsExpanded) => {
    setSectionsExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
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

  const totalListedItems = inventory.filter(item => item.status === "listed");
  const totalAvailableItems = inventory.filter(item => item.status === "available");
  const totalValue = inventory.reduce((sum, item) => sum + item.est_price, 0);

  return (
    <div className="w-full bg-background">
      {/* Header Section */}
      <div className="space-y-4 sm:space-y-6">
        <PageHeader
          title="Inventory Management"
          description="Monitor and manage inventory status"
        />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Available Items</p>
                  <p className="text-xl sm:text-2xl font-bold text-available">{availableItemsList.length}</p>
                  <p className="text-xs text-muted-foreground">USD {availableItemsList.reduce((sum, item) => sum + item.est_price, 0).toLocaleString()}</p>
                </div>
                <Package className="h-6 w-6 sm:h-8 sm:w-8 text-available flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Listed Items</p>
                  <p className="text-xl sm:text-2xl font-bold text-listed">{listedItemsList.length}</p>
                  <p className="text-xs text-muted-foreground">USD {listedItemsList.reduce((sum, item) => sum + item.est_price, 0).toLocaleString()}</p>
                </div>
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-listed flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Ordered Items</p>
                  <p className="text-xl sm:text-2xl font-bold text-ordered">{orderedItems.length}</p>
                  <p className="text-xs text-muted-foreground">USD {orderedItems.reduce((sum, item) => sum + item.est_price, 0).toLocaleString()}</p>
                </div>
                <Package className="h-6 w-6 sm:h-8 sm:w-8 text-ordered flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Sold Items</p>
                  <p className="text-xl sm:text-2xl font-bold text-sold">{soldItems.length}</p>
                  <p className="text-xs text-muted-foreground">USD {soldItems.reduce((sum, item) => sum + item.est_price, 0).toLocaleString()}</p>
                </div>
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-sold flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Bar */}
        <InventoryActionBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedItems={selectedItems}
          onListItems={handleListItems}
          onUnlistItems={handleUnlistItems}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          userRole="Vendor Admin"
          availableItems={availableItemsList}
          listedItems={listedItemsList}
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

      {/* Content Section - Scrollable with Status Groups */}
      <div className="space-y-4 sm:space-y-6">
        {/* Available Section */}
        <div className="bg-card rounded-lg border border-border">
          <Collapsible 
            open={sectionsExpanded.available} 
            onOpenChange={() => toggleSection('available')}
          >
            <CollapsibleTrigger className="w-full">
              <div className="px-4 py-3 border-b border-border bg-available/10 flex items-center justify-between hover:bg-available/20 transition-colors">
                <div className="flex items-center space-x-3">
                  <h3 className="font-semibold text-available">Available ({availableItemsList.length})</h3>
                  {selectedAvailableItems.length > 0 && (
                    <div className="flex items-center space-x-2 ml-auto mr-4">
                      <span className="text-sm text-available">{selectedAvailableItems.length} item(s) selected</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleListItems();
                        }}
                        className="bg-available/10 hover:bg-available/20 text-available border-available/30"
                      >
                        Mark as Listed
                      </Button>
                    </div>
                  )}
                </div>
                {sectionsExpanded.available ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {availableItemsList.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">No available products</div>
              ) : (
                <InventoryTable
                  inventory={availableItemsList}
                  selectedItems={selectedItems}
                  onSelectItem={handleSelectItem}
                  onSelectAll={(checked) => handleSectionSelectAll(availableItemsList, checked)}
                  viewMode={viewMode}
                  showAddToCart={false}
                  showSource={true}
                />
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Listed Section */}
        <div className="bg-card rounded-lg border border-border">
          <Collapsible 
            open={sectionsExpanded.listed} 
            onOpenChange={() => toggleSection('listed')}
          >
            <CollapsibleTrigger className="w-full">
              <div className="px-4 py-3 border-b border-border bg-listed/10 flex items-center justify-between hover:bg-listed/20 transition-colors">
                <div className="flex items-center space-x-3">
                  <h3 className="font-semibold text-listed">Listed ({listedItemsList.length})</h3>
                  {selectedListedItems.length > 0 && (
                    <div className="flex items-center space-x-2 ml-auto mr-4">
                      <span className="text-sm text-listed">{selectedListedItems.length} item(s) selected</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnlistItems();
                        }}
                        className="bg-listed/10 hover:bg-listed/20 text-listed border-listed/30"
                      >
                        Unlist
                      </Button>
                    </div>
                  )}
                </div>
                {sectionsExpanded.listed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {listedItemsList.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">No listed products</div>
              ) : (
                <InventoryTable
                  inventory={listedItemsList}
                  selectedItems={selectedItems}
                  onSelectItem={handleSelectItem}
                  onSelectAll={(checked) => handleSectionSelectAll(listedItemsList, checked)}
                  viewMode={viewMode}
                  showAddToCart={false}
                  showSource={true}
                />
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Ordered Section */}
        <div className="bg-card rounded-lg border border-border">
          <Collapsible 
            open={sectionsExpanded.ordered} 
            onOpenChange={() => toggleSection('ordered')}
          >
            <CollapsibleTrigger className="w-full">
              <div className="px-4 py-3 border-b border-border bg-ordered/10 flex items-center justify-between hover:bg-ordered/20 transition-colors">
                <div className="flex items-center space-x-3">
                  <h3 className="font-semibold text-ordered">Ordered ({orderedItems.length})</h3>
                </div>
                {sectionsExpanded.ordered ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {orderedItems.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">No ordered products</div>
              ) : (
                <InventoryTable
                  inventory={orderedItems}
                  selectedItems={selectedItems}
                  onSelectItem={handleSelectItem}
                  onSelectAll={() => {}} // Disable select all for ordered items
                  viewMode={viewMode}
                  showAddToCart={false}
                  showSource={true}
                />
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Sold Section */}
        <div className="bg-card rounded-lg border border-border">
          <Collapsible 
            open={sectionsExpanded.sold} 
            onOpenChange={() => toggleSection('sold')}
          >
            <CollapsibleTrigger className="w-full">
              <div className="px-4 py-3 border-b border-border bg-sold/10 flex items-center justify-between hover:bg-sold/20 transition-colors">
                <div className="flex items-center space-x-3">
                  <h3 className="font-semibold text-sold">Sold ({soldItems.length})</h3>
                </div>
                {sectionsExpanded.sold ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {soldItems.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">No sold products</div>
              ) : (
                <InventoryTable
                  inventory={soldItems}
                  selectedItems={selectedItems}
                  onSelectItem={handleSelectItem}
                  onSelectAll={handleSelectAll}
                  viewMode={viewMode}
                  showAddToCart={false}
                  showSource={true}
                />
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagementPage;