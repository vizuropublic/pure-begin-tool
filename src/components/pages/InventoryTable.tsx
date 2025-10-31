import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Package, ChevronUp, ChevronDown, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { InventoryItemDisplay } from "@/hooks/useInventory";
import { ImagePreviewDialog } from "@/components/ui/image-preview-dialog";

type SortField = 'name' | 'type' | 'make' | 'family' | 'subcategory' | 'possibility' | 'status' | 'price' | 'updateDate' | 'source' | 'location';
type SortDirection = 'asc' | 'desc';

interface InventoryTableProps {
  inventory: InventoryItemDisplay[];
  selectedItems: string[];
  onSelectItem: (itemId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  viewMode: 'list' | 'grid';
  showAddToCart?: boolean;
  showSource?: boolean;
}

export const InventoryTable = ({
  inventory,
  selectedItems,
  onSelectItem,
  onSelectAll,
  viewMode,
  showAddToCart = true,
  showSource = true
}: InventoryTableProps) => {
  inventory.forEach(e => { 
    if (e.inventory_photo && Array.isArray(e.inventory_photo) && e.inventory_photo.length > 0) {
      e.inventory_photo.forEach((i: any) => {
        if (i.is_primary) e.image = i.file_path;
      });
    }
  });
  const { addToCart } = useCart();
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const isMobile = useIsMobile();
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedItemForPreview, setSelectedItemForPreview] = useState<InventoryItemDisplay | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedInventory = [...inventory].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    // Handle price sorting (remove currency and convert to number)
    if (sortField === 'price') {
      aValue = parseInt(a.price.replace(/[^0-9]/g, ''));
      bValue = parseInt(b.price.replace(/[^0-9]/g, ''));
    }

    // Handle date sorting
    if (sortField === 'updateDate') {
      aValue = new Date(a.updateDate);
      bValue = new Date(b.updateDate);
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ChevronUp className="ml-1 h-3 w-3 text-gray-400" />;
    return sortDirection === 'asc' ? 
      <ChevronUp className="ml-1 h-3 w-3 text-gray-600" /> : 
      <ChevronDown className="ml-1 h-3 w-3 text-gray-600" />;
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-100 text-green-800">Available</Badge>;
      case "listed":
        return <Badge className="bg-blue-100 text-blue-800">Listed</Badge>;
      case "ordered":
        return <Badge className="bg-yellow-100 text-yellow-800">Ordered</Badge>;
      case "sold":
        return <Badge className="bg-gray-100 text-gray-800">Sold</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPossibilityBadge = (possibility: string) => {
    switch (possibility) {
      case "High":
        return <Badge className="bg-green-100 text-green-800">High</Badge>;
      case "Medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case "Low":
        return <Badge className="bg-red-100 text-red-800">Low</Badge>;
      case "Manual":
        return <Badge className="bg-blue-100 text-blue-800">Manual</Badge>;
      default:
        return <Badge variant="secondary">{possibility}</Badge>;
    }
  };

  // Grid View Component
  const renderGridView = () => (
    <div className="h-full overflow-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 pt-4">
        {sortedInventory.map((item) => (
          <div key={item.id} className="flex flex-col h-full p-3 sm:p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-200 w-full">
            {/* Photo - Responsive */}
            <div className="relative aspect-[5/4] bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mb-3">
                <Checkbox
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={(checked) => onSelectItem(item.id, checked as boolean)}
                  className="absolute top-2 left-2 z-10"
                  disabled={item.status === "ordered" || item.status === "sold"}
                />
              {item.image && item.image !== "/placeholder.svg" ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => {
                    setSelectedItemForPreview(item);
                    setPreviewDialogOpen(true);
                  }}
                />
              ) : (
                <Package className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
              )}
            </div>
              
            {/* Name & ID - Emphasized */}
            <div className="flex-shrink-0 mb-2">
              <div className="font-semibold text-gray-900 text-xs sm:text-sm line-clamp-2 leading-tight break-words">{item.name}</div>
              <div className="text-xs text-gray-500 mt-1 font-mono truncate">{item.id}</div>
            </div>
            
            {/* Possibility - Compact */}
            <div className="flex flex-wrap gap-2 flex-shrink-0 mb-2">
              {getPossibilityBadge(item.possibility)}
            </div>
            
            {/* Other Info - Compact (flexible space) */}
            <div className="text-xs text-gray-500 space-y-1 flex-1 mb-3">
              <div className="flex justify-between">
                <span className="font-medium">Type:</span>
                <span>{item.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Make:</span>
                <span>{item.make}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Family:</span>
                <span>{item.family}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Subcategory:</span>
                <span>{item.subcategory || "--"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Updated:</span>
                <span>{item.updateDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Location:</span>
                <span>{item.location || "--"}</span>
              </div>
            </div>
            
            {/* Price and Add to Cart - Stick to bottom */}
            <div className="flex items-center justify-between mt-auto">
              <div className="text-sm font-bold text-gray-900">{item.price}</div>
              {showAddToCart && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addToCart({
                    id: parseInt(item.id.slice(-8), 16), // Convert UUID to number for cart compatibility
                    name: item.name,
                    productId: item.id,
                    type: item.type,
                    price: item.price,
                    image: item.image,
                    location: item.location,
                  })}
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Mobile Card List View
  const renderMobileListView = () => (
    <div className="space-y-3 p-3">
      {/* Select All */}
      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={selectedItems.filter(id => inventory.some(item => item.id === id)).length === inventory.length && inventory.length > 0}
            onCheckedChange={onSelectAll}
            disabled={inventory.every(item => item.status === "ordered")}
          />
          <span className="text-sm font-medium">Select All</span>
        </div>
        <div className="text-sm text-muted-foreground">
          {selectedItems.length} selected
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
        <span className="text-sm font-medium">Sort by:</span>
        <select 
          value={sortField} 
          onChange={(e) => handleSort(e.target.value as SortField)}
          className="text-sm border border-gray-200 rounded px-2 py-1 bg-white"
        >
          <option value="name">Name</option>
          <option value="type">Type</option>
          <option value="make">Make</option>
          <option value="family">Family</option>
          <option value="subcategory">Subcategory</option>
          <option value="possibility">Possibility</option>
          <option value="status">Status</option>
          <option value="price">Price</option>
          <option value="updateDate">Update Date</option>
          <option value="location">Location</option>
          {showSource && <option value="source">Source</option>}
        </select>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
        >
          {sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {/* Items */}
      {sortedInventory.map((item) => (
        <Card key={item.id} className="p-4 space-y-3">
          {/* Header with checkbox and photo */}
          <div className="flex items-start space-x-3">
            <Checkbox
              checked={selectedItems.includes(item.id)}
              onCheckedChange={(checked) => onSelectItem(item.id, checked as boolean)}
              disabled={item.status === "ordered" || item.status === "sold"}
              className="mt-1"
            />
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
              {item.image && item.image !== "/placeholder.svg" ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => {
                    setSelectedItemForPreview(item);
                    setPreviewDialogOpen(true);
                  }}
                />
              ) : (
                <Package className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 text-sm leading-tight break-words">{item.name}</div>
              <div className="text-xs text-gray-500 font-mono mt-1">{item.id}</div>
              <div className="flex items-center space-x-2 mt-2">
                {getPossibilityBadge(item.possibility)}
                {getStatusBadge(item.status)}
              </div>
            </div>
          </div>
          
          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Type:</span>
              <div className="font-medium">{item.type}</div>
            </div>
            <div>
              <span className="text-gray-500">Make:</span>
              <div className="font-medium">{item.make}</div>
            </div>
            <div>
              <span className="text-gray-500">Family:</span>
              <div className="font-medium">{item.family}</div>
            </div>
            <div>
              <span className="text-gray-500">Subcategory:</span>
              <div className="font-medium">{item.subcategory || "--"}</div>
            </div>
            <div>
              <span className="text-gray-500">Location:</span>
              <div className="font-medium">{item.location || "--"}</div>
            </div>
            {showSource && (
              <div>
                <span className="text-gray-500">Source:</span>
                <div className="font-medium">{item.source}</div>
              </div>
            )}
            <div>
              <span className="text-gray-500">Updated:</span>
              <div className="font-medium">{item.updateDate}</div>
            </div>
          </div>
          
          {/* Price and Actions */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="text-lg font-bold text-gray-900">{item.price}</div>
            {showAddToCart && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => addToCart({
                  id: parseInt(item.id.slice(-8), 16),
                  name: item.name,
                  productId: item.id,
                  type: item.type,
                  price: item.price,
                  image: item.image,
                  location: item.location,
                })}
                className="h-9 px-3"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Add
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );

  // Desktop Table List View
  const renderDesktopListView = () => (
    <TooltipProvider>
      <div className="w-full">
        <Table enableScroll={false} className="w-full">
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow>
              {/* Checkbox - Fixed width */}
              <TableHead className="w-12 px-2">
                <Checkbox
                  checked={selectedItems.filter(id => inventory.some(item => item.id === id)).length === inventory.length && inventory.length > 0}
                  onCheckedChange={onSelectAll}
                  disabled={inventory.every(item => item.status === "ordered")}
                />
              </TableHead>
              
              {/* Photo - Fixed width */}
              <TableHead className="w-16 px-2">Photo</TableHead>
              
              {/* RWD: 4 columns for ≤1279px */}
              <TableHead className="min-w-0 px-2 xl:hidden">
                <div className="flex items-center cursor-pointer" onClick={() => handleSort('name')}>
                  Name / ID
                  {getSortIcon('name')}
                </div>
              </TableHead>
              <TableHead className="px-2 xl:hidden">
                <div className="flex items-center cursor-pointer whitespace-nowrap" onClick={() => handleSort('type')}>
                  Info
                  {getSortIcon('type')}
                </div>
              </TableHead>
              <TableHead className="px-2 xl:hidden">
                <div className="flex items-center cursor-pointer whitespace-nowrap" onClick={() => handleSort('price')}>
                  Details
                  {getSortIcon('price')}
                </div>
              </TableHead>
              
              {/* Desktop: Full columns for >1279px */}
              <TableHead className="min-w-0 px-2 hidden xl:table-cell">
                <div className="flex items-center cursor-pointer" onClick={() => handleSort('name')}>
                  Name / ID
                  {getSortIcon('name')}
                </div>
              </TableHead>
              
              <TableHead className="px-2 hidden xl:table-cell">
                <div className="flex items-center cursor-pointer whitespace-nowrap" onClick={() => handleSort('type')}>
                  Type
                  {getSortIcon('type')}
                </div>
              </TableHead>
              
              <TableHead className="px-2 hidden xl:table-cell">
                <div className="flex items-center cursor-pointer whitespace-nowrap" onClick={() => handleSort('make')}>
                  Make
                  {getSortIcon('make')}
                </div>
              </TableHead>
              
              <TableHead className="px-2 hidden xl:table-cell">
                <div className="flex items-center cursor-pointer whitespace-nowrap" onClick={() => handleSort('family')}>
                  Family
                  {getSortIcon('family')}
                </div>
              </TableHead>
              
              <TableHead className="px-2 hidden xl:table-cell">
                <div className="flex items-center cursor-pointer whitespace-nowrap" onClick={() => handleSort('subcategory')}>
                  Subcategory
                  {getSortIcon('subcategory')}
                </div>
              </TableHead>
              
              <TableHead className="px-2 hidden xl:table-cell">
                <div className="flex items-center cursor-pointer whitespace-nowrap" onClick={() => handleSort('possibility')}>
                  Possibility
                  {getSortIcon('possibility')}
                </div>
              </TableHead>
              
              <TableHead className="px-2 hidden xl:table-cell">
                <div className="flex items-center cursor-pointer whitespace-nowrap" onClick={() => handleSort('price')}>
                  Price
                  {getSortIcon('price')}
                </div>
              </TableHead>
              
              {showSource && (
                <TableHead className="px-2 hidden xl:table-cell">
                  <div className="flex items-center cursor-pointer whitespace-nowrap" onClick={() => handleSort('source')}>
                    Source
                    {getSortIcon('source')}
                  </div>
                </TableHead>
              )}
              
              <TableHead className="px-2 hidden xl:table-cell">
                <div className="flex items-center cursor-pointer whitespace-nowrap" onClick={() => handleSort('location')}>
                  Location
                  {getSortIcon('location')}
                </div>
              </TableHead>
              
              <TableHead className="px-2 hidden xl:table-cell">
                <div className="flex items-center cursor-pointer whitespace-nowrap" onClick={() => handleSort('updateDate')}>
                  Date
                  {getSortIcon('updateDate')}
                </div>
              </TableHead>
              
              {/* Actions */}
              {showAddToCart && <TableHead className="px-2 whitespace-nowrap">Actions</TableHead>}
            </TableRow>
          </TableHeader>
        <TableBody>
          {sortedInventory.map((item) => (
            <TableRow key={item.id}>
              {/* Checkbox */}
              <TableCell className="px-2">
                <Checkbox
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={(checked) => onSelectItem(item.id, checked as boolean)}
                  disabled={item.status === "ordered" || item.status === "sold"}
                />
              </TableCell>
              
              {/* Photo */}
               <TableCell className="px-2">
                 <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                   {item.image && item.image !== "/placeholder.svg" ? (
                 <img
                   src={item.image}
                   alt={item.name}
                   className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                   onClick={() => {
                     setSelectedItemForPreview(item);
                     setPreviewDialogOpen(true);
                   }}
                 />
               ) : (
                 <Package className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
               )}
                 </div>
               </TableCell>
              
              {/* RWD: Column 2 - Name/ID, Possibility, Source (≤1279px) */}
              <TableCell className="px-2 xl:hidden">
                <div className="min-w-0">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="font-medium text-gray-900 truncate cursor-help">
                        {item.name}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{item.name}</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="text-xs text-gray-500 font-mono mt-1">{item.id}</div>
                  <div className="flex items-center gap-2 mt-1">
                    {getPossibilityBadge(item.possibility)}
                    <span className="text-xs text-gray-500">{item.source}</span>
                  </div>
                </div>
              </TableCell>
              
               {/* RWD: Column 3 - Type, Make, Family, Subcategory (≤1279px) */}
               <TableCell className="px-2 xl:hidden">
                 <div className="text-sm space-y-1">
                   <div><span className="font-medium">{item.type}</span></div>
                   <div className="text-xs text-gray-500">{item.make} • {item.family}</div>
                   <div className="text-xs text-gray-500">{item.subcategory || "--"}</div>
                 </div>
               </TableCell>
              
              {/* RWD: Column 4 - Price, Location, Date (≤1279px) */}
              <TableCell className="px-2 xl:hidden">
                <div className="text-sm space-y-1">
                  <div className="font-bold">{item.price}</div>
                  <div className="text-xs text-gray-500">{item.location || "--"} • {item.updateDate}</div>
                </div>
              </TableCell>
              
              {/* Desktop: Full columns (>1279px) */}
              <TableCell className="px-2 hidden xl:table-cell">
                <div className="min-w-0">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="font-medium text-gray-900 truncate cursor-help">
                        {item.name}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{item.name}</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-sm text-gray-500 truncate font-mono cursor-help">
                        {item.id}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{item.id}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TableCell>

              <TableCell className="px-2 hidden xl:table-cell">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="whitespace-nowrap truncate max-w-[100px] cursor-help inline-block">
                      {item.type || "--"}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.type || "--"}</p>
                  </TooltipContent>
                </Tooltip>
              </TableCell>
              
              <TableCell className="px-2 hidden xl:table-cell">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="whitespace-nowrap truncate max-w-[100px] cursor-help inline-block">
                      {item.make || "--"}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.make || "--"}</p>
                  </TooltipContent>
                </Tooltip>
              </TableCell>
              
              <TableCell className="px-2 hidden xl:table-cell">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="whitespace-nowrap truncate max-w-[100px] cursor-help inline-block">
                      {item.family || "--"}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.family || "--"}</p>
                  </TooltipContent>
                </Tooltip>
              </TableCell>
              
              <TableCell className="px-2 hidden xl:table-cell">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="whitespace-nowrap truncate max-w-[100px] cursor-help inline-block">
                      {item.subcategory || "--"}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.subcategory || "--"}</p>
                  </TooltipContent>
                </Tooltip>
              </TableCell>
              
              <TableCell className="px-2 hidden xl:table-cell">{getPossibilityBadge(item.possibility)}</TableCell>
              
              <TableCell className="px-2 hidden xl:table-cell">
                <span className="font-medium whitespace-nowrap">{item.price}</span>
              </TableCell>
              
              {showSource && (
                <TableCell className="px-2 hidden xl:table-cell">
                  <span className="whitespace-nowrap">{item.source}</span>
                </TableCell>
              )}
              
              <TableCell className="px-2 hidden xl:table-cell">
                <span className="whitespace-nowrap">{item.location || "--"}</span>
              </TableCell>
              
              <TableCell className="px-2 hidden xl:table-cell">
                <span className="text-sm whitespace-nowrap">{item.updateDate}</span>
              </TableCell>
              
              {/* Actions */}
              {showAddToCart && (
                <TableCell className="px-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addToCart({
                      id: parseInt(item.id.slice(-8), 16),
                      name: item.name,
                      productId: item.id,
                      type: item.type,
                      price: item.price,
                      image: item.image,
                      location: item.location,
                    })}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    </TooltipProvider>
  );

  // List View Component  
  const renderListView = () => (
    <div className="h-full overflow-auto">
      {isMobile ? renderMobileListView() : renderDesktopListView()}
    </div>
  );

  return (
    <div className="h-full">
      {viewMode === 'grid' ? renderGridView() : (
        <Card className="h-full">
          {renderListView()}
        </Card>
      )}
      
      <ImagePreviewDialog
        isOpen={previewDialogOpen}
        onClose={() => {
          setPreviewDialogOpen(false);
          setSelectedItemForPreview(null);
        }}
        images={selectedItemForPreview?.inventory_photo || []}
        itemName={selectedItemForPreview?.name || ''}
      />
    </div>
  );
};