import { useState, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdvancedFilters } from "./search/AdvancedFilters";
import { cn } from "@/lib/utils";

export type SearchScope = 
  | "All"
  | "Customer Quotes"
  | "Sales Invoices"
  | "Payment Received"
  | "Customers"
  | "Vendor Quotes"
  | "Purchase Invoices"
  | "Payment Made"
  | "Vendors"
  | "Items";

interface GlobalSearchProps {
  currentPage?: string;
  onSearch?: (searchTerm: string, scope: SearchScope, filters: any) => void;
}

const getDefaultScope = (currentPage?: string): SearchScope => {
  const pageToScopeMap: Record<string, SearchScope> = {
    "CustomerQuotes": "Customer Quotes",
    "SalesInvoices": "Sales Invoices",
    "PaymentReceived": "Payment Received",
    "Customers": "Customers",
    "VendorQuotes": "Vendor Quotes",
    "PurchaseOrders": "Purchase Invoices",
    "PaymentMade": "Payment Made",
    "Vendors": "Vendors",
    "Inventory": "Items",
  };

  return pageToScopeMap[currentPage || ""] || "All";
};

export const GlobalSearch = ({ currentPage, onSearch }: GlobalSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [scope, setScope] = useState<SearchScope>(getDefaultScope(currentPage));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filters, setFilters] = useState<any>({});

  // Update scope when page changes
  useEffect(() => {
    setScope(getDefaultScope(currentPage));
  }, [currentPage]);

  const handleSearch = () => {
    onSearch?.(searchTerm, scope, filters);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    onSearch?.(searchTerm, scope, newFilters);
  };

  const handleScopeChange = (newScope: SearchScope) => {
    setScope(newScope);
    setFilters({});
    onSearch?.(searchTerm, newScope, {});
  };

  return (
    <>
      <div className="flex items-center max-w-xl w-full">
        <div className="flex items-center w-full bg-muted/50 rounded-lg border border-border overflow-hidden">
          {/* Left section: Search icon + Dropdown */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            className="h-9 px-3 hover:bg-muted rounded-none border-r border-border"
          >
            <Search className="h-4 w-4 mr-1 text-muted-foreground" />
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </Button>

          {/* Right section: Search input */}
          <Input
            type="text"
            placeholder={`Search in ${scope}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-9"
          />
        </div>
      </div>

      {/* Advanced Search Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Advanced Search</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Search Scope Section */}
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <label className="text-sm font-medium mb-2 block">Search Scope</label>
              <Select value={scope} onValueChange={handleScopeChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Customer Quotes">Customer Quotes</SelectItem>
                  <SelectItem value="Sales Invoices">Sales Invoices</SelectItem>
                  <SelectItem value="Payment Received">Payment Received</SelectItem>
                  <SelectItem value="Customers">Customers</SelectItem>
                  <SelectItem value="Vendor Quotes">Vendor Quotes</SelectItem>
                  <SelectItem value="Purchase Invoices">Purchase Invoices</SelectItem>
                  <SelectItem value="Payment Made">Payment Made</SelectItem>
                  <SelectItem value="Vendors">Vendors</SelectItem>
                  <SelectItem value="Items">Items</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Advanced Filters Section */}
            <div className="bg-muted/30 p-4 rounded-lg border border-border">
              <AdvancedFilters
                scope={scope}
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({});
                  setSearchTerm("");
                }}
              >
                Clear All
              </Button>
              <Button
                onClick={() => {
                  handleSearch();
                  setIsDialogOpen(false);
                }}
              >
                Apply Search
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
