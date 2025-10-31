import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, List, Grid2X2, ShoppingCart } from "lucide-react";
import { UserRole } from "../../pages/Index";

interface InventoryActionBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedItems: string[];
  onListItems: () => void;
  onUnlistItems: () => void;
  onAddToCart?: () => void;
  viewMode: 'list' | 'grid';
  onViewModeChange: (mode: 'list' | 'grid') => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  userRole: UserRole;
  availableItems?: any[];
  listedItems?: any[];
  showCartControls?: boolean;
}

export const InventoryActionBar = ({
  searchTerm,
  setSearchTerm,
  selectedItems,
  onListItems,
  onUnlistItems,
  onAddToCart,
  viewMode,
  onViewModeChange,
  showFilters,
  onToggleFilters,
  userRole,
  availableItems = [],
  listedItems = [],
  showCartControls = false
}: InventoryActionBarProps) => {
  
  // Check if selected items are in Available or Listed sections
  const selectedAvailableItems = availableItems.filter(item => selectedItems.includes(item.id));
  const selectedListedItems = listedItems.filter(item => selectedItems.includes(item.id));
  const hasAvailableSelected = selectedAvailableItems.length > 0;
  const hasListedSelected = selectedListedItems.length > 0;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="relative w-full sm:w-64 md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search Family / Source"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={onToggleFilters} className="min-w-[80px]">
            <Filter className="h-4 w-4 mr-2" />
            <span className="hidden xs:inline">Filter</span>
          </Button>
          
          <div className="flex border rounded-md overflow-hidden">
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className="rounded-none border-0"
            >
              <Grid2X2 className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => onViewModeChange('list')}
              className="rounded-none border-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {showCartControls && selectedItems.length > 0 && (
            <>
              <span className="text-sm text-gray-600">
                {selectedItems.length} item(s) selected
              </span>
              <Button 
                variant="default" 
                size="sm" 
                onClick={onAddToCart}
                className="min-w-[120px]"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};