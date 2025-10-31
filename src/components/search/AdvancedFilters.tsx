import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchScope } from "../GlobalSearch";

interface AdvancedFiltersProps {
  scope: SearchScope;
  filters: any;
  onFilterChange: (filters: any) => void;
}

export const AdvancedFilters = ({
  scope,
  filters,
  onFilterChange,
}: AdvancedFiltersProps) => {
  const updateFilter = (key: string, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const renderCustomerQuotesFilters = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Start Date</Label>
          <Input
            type="date"
            value={filters.startDate || ""}
            onChange={(e) => updateFilter("startDate", e.target.value)}
          />
        </div>
        <div>
          <Label>End Date</Label>
          <Input
            type="date"
            value={filters.endDate || ""}
            onChange={(e) => updateFilter("endDate", e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label>Quote #</Label>
        <Input
          placeholder="Enter quote number"
          value={filters.quoteNumber || ""}
          onChange={(e) => updateFilter("quoteNumber", e.target.value)}
        />
      </div>
      <div>
        <Label>Customer Name</Label>
        <Input
          placeholder="Enter customer name"
          value={filters.customerName || ""}
          onChange={(e) => updateFilter("customerName", e.target.value)}
        />
      </div>
      <div>
        <Label>Status</Label>
        <Select
          value={filters.status || ""}
          onValueChange={(value) => updateFilter("status", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Min Total</Label>
          <Input
            type="number"
            placeholder="0"
            value={filters.minTotal || ""}
            onChange={(e) => updateFilter("minTotal", e.target.value)}
          />
        </div>
        <div>
          <Label>Max Total</Label>
          <Input
            type="number"
            placeholder="0"
            value={filters.maxTotal || ""}
            onChange={(e) => updateFilter("maxTotal", e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderSalesInvoicesFilters = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Start Date</Label>
          <Input
            type="date"
            value={filters.startDate || ""}
            onChange={(e) => updateFilter("startDate", e.target.value)}
          />
        </div>
        <div>
          <Label>End Date</Label>
          <Input
            type="date"
            value={filters.endDate || ""}
            onChange={(e) => updateFilter("endDate", e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label>Invoice #</Label>
        <Input
          placeholder="Enter invoice number"
          value={filters.invoiceNumber || ""}
          onChange={(e) => updateFilter("invoiceNumber", e.target.value)}
        />
      </div>
      <div>
        <Label>Customer Name</Label>
        <Input
          placeholder="Enter customer name"
          value={filters.customerName || ""}
          onChange={(e) => updateFilter("customerName", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Min Amount</Label>
          <Input
            type="number"
            placeholder="0"
            value={filters.minAmount || ""}
            onChange={(e) => updateFilter("minAmount", e.target.value)}
          />
        </div>
        <div>
          <Label>Max Amount</Label>
          <Input
            type="number"
            placeholder="0"
            value={filters.maxAmount || ""}
            onChange={(e) => updateFilter("maxAmount", e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label>Status</Label>
        <Select
          value={filters.status || ""}
          onValueChange={(value) => updateFilter("status", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="unpaid">Unpaid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderPaymentReceivedFilters = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Start Date</Label>
          <Input
            type="date"
            value={filters.startDate || ""}
            onChange={(e) => updateFilter("startDate", e.target.value)}
          />
        </div>
        <div>
          <Label>End Date</Label>
          <Input
            type="date"
            value={filters.endDate || ""}
            onChange={(e) => updateFilter("endDate", e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label>Payment Method</Label>
        <Select
          value={filters.paymentMethod || ""}
          onValueChange={(value) => updateFilter("paymentMethod", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="credit_card">Credit Card</SelectItem>
            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            <SelectItem value="check">Check</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Customer</Label>
        <Input
          placeholder="Enter customer name"
          value={filters.customer || ""}
          onChange={(e) => updateFilter("customer", e.target.value)}
        />
      </div>
      <div>
        <Label>Related Invoice #</Label>
        <Input
          placeholder="Enter invoice number"
          value={filters.relatedInvoice || ""}
          onChange={(e) => updateFilter("relatedInvoice", e.target.value)}
        />
      </div>
    </div>
  );

  const renderCustomersFilters = () => (
    <div className="space-y-4">
      <div>
        <Label>Name</Label>
        <Input
          placeholder="Enter customer name"
          value={filters.name || ""}
          onChange={(e) => updateFilter("name", e.target.value)}
        />
      </div>
      <div>
        <Label>Company</Label>
        <Input
          placeholder="Enter company name"
          value={filters.company || ""}
          onChange={(e) => updateFilter("company", e.target.value)}
        />
      </div>
      <div>
        <Label>Email</Label>
        <Input
          type="email"
          placeholder="Enter email address"
          value={filters.email || ""}
          onChange={(e) => updateFilter("email", e.target.value)}
        />
      </div>
    </div>
  );

  const renderVendorQuotesFilters = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Start Date</Label>
          <Input
            type="date"
            value={filters.startDate || ""}
            onChange={(e) => updateFilter("startDate", e.target.value)}
          />
        </div>
        <div>
          <Label>End Date</Label>
          <Input
            type="date"
            value={filters.endDate || ""}
            onChange={(e) => updateFilter("endDate", e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label>Quote #</Label>
        <Input
          placeholder="Enter quote number"
          value={filters.quoteNumber || ""}
          onChange={(e) => updateFilter("quoteNumber", e.target.value)}
        />
      </div>
      <div>
        <Label>Vendor Name</Label>
        <Input
          placeholder="Enter vendor name"
          value={filters.vendorName || ""}
          onChange={(e) => updateFilter("vendorName", e.target.value)}
        />
      </div>
    </div>
  );

  const renderPurchaseInvoicesFilters = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Start Date</Label>
          <Input
            type="date"
            value={filters.startDate || ""}
            onChange={(e) => updateFilter("startDate", e.target.value)}
          />
        </div>
        <div>
          <Label>End Date</Label>
          <Input
            type="date"
            value={filters.endDate || ""}
            onChange={(e) => updateFilter("endDate", e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label>Invoice #</Label>
        <Input
          placeholder="Enter invoice number"
          value={filters.invoiceNumber || ""}
          onChange={(e) => updateFilter("invoiceNumber", e.target.value)}
        />
      </div>
      <div>
        <Label>Vendor Name</Label>
        <Input
          placeholder="Enter vendor name"
          value={filters.vendorName || ""}
          onChange={(e) => updateFilter("vendorName", e.target.value)}
        />
      </div>
      <div>
        <Label>Status</Label>
        <Select
          value={filters.status || ""}
          onValueChange={(value) => updateFilter("status", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="unpaid">Unpaid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderPaymentMadeFilters = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Start Date</Label>
          <Input
            type="date"
            value={filters.startDate || ""}
            onChange={(e) => updateFilter("startDate", e.target.value)}
          />
        </div>
        <div>
          <Label>End Date</Label>
          <Input
            type="date"
            value={filters.endDate || ""}
            onChange={(e) => updateFilter("endDate", e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label>Payment Method</Label>
        <Select
          value={filters.paymentMethod || ""}
          onValueChange={(value) => updateFilter("paymentMethod", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="credit_card">Credit Card</SelectItem>
            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            <SelectItem value="check">Check</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Vendor</Label>
        <Input
          placeholder="Enter vendor name"
          value={filters.vendor || ""}
          onChange={(e) => updateFilter("vendor", e.target.value)}
        />
      </div>
    </div>
  );

  const renderVendorsFilters = () => (
    <div className="space-y-4">
      <div>
        <Label>Name</Label>
        <Input
          placeholder="Enter vendor name"
          value={filters.name || ""}
          onChange={(e) => updateFilter("name", e.target.value)}
        />
      </div>
      <div>
        <Label>Company</Label>
        <Input
          placeholder="Enter company name"
          value={filters.company || ""}
          onChange={(e) => updateFilter("company", e.target.value)}
        />
      </div>
      <div>
        <Label>Email</Label>
        <Input
          type="email"
          placeholder="Enter email address"
          value={filters.email || ""}
          onChange={(e) => updateFilter("email", e.target.value)}
        />
      </div>
    </div>
  );

  const renderItemsFilters = () => (
    <div className="space-y-4">
      <div>
        <Label>Item Name</Label>
        <Input
          placeholder="Enter item name"
          value={filters.itemName || ""}
          onChange={(e) => updateFilter("itemName", e.target.value)}
        />
      </div>
      <div>
        <Label>Category</Label>
        <Input
          placeholder="Enter category"
          value={filters.category || ""}
          onChange={(e) => updateFilter("category", e.target.value)}
        />
      </div>
      <div>
        <Label>SKU</Label>
        <Input
          placeholder="Enter SKU"
          value={filters.sku || ""}
          onChange={(e) => updateFilter("sku", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Min Price</Label>
          <Input
            type="number"
            placeholder="0"
            value={filters.minPrice || ""}
            onChange={(e) => updateFilter("minPrice", e.target.value)}
          />
        </div>
        <div>
          <Label>Max Price</Label>
          <Input
            type="number"
            placeholder="0"
            value={filters.maxPrice || ""}
            onChange={(e) => updateFilter("maxPrice", e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderAllFilters = () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Select a specific scope to see advanced filters
      </p>
    </div>
  );

  const renderFilters = () => {
    switch (scope) {
      case "Customer Quotes":
        return renderCustomerQuotesFilters();
      case "Sales Invoices":
        return renderSalesInvoicesFilters();
      case "Payment Received":
        return renderPaymentReceivedFilters();
      case "Customers":
        return renderCustomersFilters();
      case "Vendor Quotes":
        return renderVendorQuotesFilters();
      case "Purchase Invoices":
        return renderPurchaseInvoicesFilters();
      case "Payment Made":
        return renderPaymentMadeFilters();
      case "Vendors":
        return renderVendorsFilters();
      case "Items":
        return renderItemsFilters();
      case "All":
      default:
        return renderAllFilters();
    }
  };

  return (
    <div>
      <label className="text-sm font-medium mb-3 block">Advanced Filters</label>
      {renderFilters()}
    </div>
  );
};
