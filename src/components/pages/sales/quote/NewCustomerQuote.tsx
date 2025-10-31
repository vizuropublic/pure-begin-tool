import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash2, GripVertical, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { ItemPickerModal } from "./ItemPickerModal";
import { useCustomers } from "@/hooks/useCustomerQuotes";
import { Badge } from "@/components/ui/badge";

interface QuoteFormData {
  customer_id: string;
  reference: string;
  quote_date: Date;
  expire_date: Date;
  sales_person: string;
  subject: string;
  items: QuoteLineItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  email_recipients: string[];
}

interface QuoteLineItem {
  id: string;
  item_id: string | null;
  item_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

interface NewCustomerQuoteProps {
  onBack: () => void;
  onSave: (data: QuoteFormData, action: "draft" | "preview") => void;
  initialData?: Partial<QuoteFormData>;
  quoteNumber?: string;
}

export const NewCustomerQuote = ({
  onBack,
  onSave,
  initialData,
  quoteNumber = "QT-00001",
}: NewCustomerQuoteProps) => {
  const { data: customers = [] } = useCustomers();
  const [showItemPicker, setShowItemPicker] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  const [formData, setFormData] = useState<QuoteFormData>({
    customer_id: initialData?.customer_id || "",
    reference: initialData?.reference || "",
    quote_date: initialData?.quote_date || new Date(),
    expire_date: initialData?.expire_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    sales_person: initialData?.sales_person || "",
    subject: initialData?.subject || "",
    items: initialData?.items || [],
    subtotal: initialData?.subtotal || 0,
    shipping: initialData?.shipping || 0,
    tax: initialData?.tax || 0,
    total: initialData?.total || 0,
    email_recipients: initialData?.email_recipients || [],
  });

  // Recalculate totals when items, shipping, or tax change
  useEffect(() => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.subtotal, 0);
    const total = subtotal + formData.shipping + formData.tax;
    
    setFormData((prev) => ({
      ...prev,
      subtotal,
      total,
    }));
  }, [formData.items, formData.shipping, formData.tax]);

  // Auto-populate email when customer changes
  useEffect(() => {
    if (formData.customer_id) {
      const customer = customers.find((c) => c.id === formData.customer_id);
      if (customer?.email && !formData.email_recipients.includes(customer.email)) {
        setFormData((prev) => ({
          ...prev,
          email_recipients: [customer.email],
        }));
      }
    }
  }, [formData.customer_id, customers]);

  const handleAddItems = (inventoryItems: any[]) => {
    const newItems: QuoteLineItem[] = inventoryItems.map((item) => ({
      id: crypto.randomUUID(),
      item_id: item.id,
      item_name: item.name,
      quantity: 1,
      unit_price: item.price,
      subtotal: item.price,
    }));

    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, ...newItems],
    }));
  };

  const handleUpdateItem = (id: string, field: keyof QuoteLineItem, value: any) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id !== id) return item;
        
        const updated = { ...item, [field]: value };
        if (field === "quantity" || field === "unit_price") {
          updated.subtotal = updated.quantity * updated.unit_price;
        }
        return updated;
      }),
    }));
  };

  const handleDeleteItem = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const handleAddEmail = () => {
    if (emailInput && !formData.email_recipients.includes(emailInput)) {
      setFormData((prev) => ({
        ...prev,
        email_recipients: [...prev.email_recipients, emailInput],
      }));
      setEmailInput("");
    }
  };

  const handleRemoveEmail = (email: string) => {
    setFormData((prev) => ({
      ...prev,
      email_recipients: prev.email_recipients.filter((e) => e !== email),
    }));
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Quotes
        </Button>
      </div>

      {/* Form Fields - Two Rows */}
      <div className="bg-card rounded-lg border p-6 space-y-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Quote #</Label>
            <Input value={quoteNumber} disabled className="bg-muted" />
          </div>
          <div>
            <Label>Customer *</Label>
            <Select
              value={formData.customer_id}
              onValueChange={(value) => setFormData({ ...formData, customer_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.first_name} {customer.last_name}
                    {customer.company_name && ` (${customer.company_name})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Reference</Label>
            <Input
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              placeholder="Reference number"
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Quote Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.quote_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.quote_date ? format(formData.quote_date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.quote_date}
                  onSelect={(date) => date && setFormData({ ...formData, quote_date: date })}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label>Expire Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.expire_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.expire_date ? format(formData.expire_date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.expire_date}
                  onSelect={(date) => date && setFormData({ ...formData, expire_date: date })}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label>Sales Person</Label>
            <Input
              value={formData.sales_person}
              onChange={(e) => setFormData({ ...formData, sales_person: e.target.value })}
              placeholder="Sales person name"
            />
          </div>
        </div>

        {/* Subject */}
        <div>
          <Label>Subject</Label>
          <Textarea
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="Let your customers know what this quote is for"
            rows={3}
          />
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-card rounded-lg border">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">Items</h3>
          <Button onClick={() => setShowItemPicker(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Items
          </Button>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead className="w-20">Item #</TableHead>
              <TableHead>Item Name</TableHead>
              <TableHead className="w-24">Qty</TableHead>
              <TableHead className="w-32">Unit Price</TableHead>
              <TableHead className="w-32">Subtotal</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formData.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No items added. Click "Add Items" to get started.
                </TableCell>
              </TableRow>
            ) : (
              formData.items.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                  </TableCell>
                  <TableCell className="font-mono text-sm">{index + 1}</TableCell>
                  <TableCell className="font-medium">{item.item_name}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleUpdateItem(item.id, "quantity", parseInt(e.target.value) || 1)
                      }
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unit_price}
                      onChange={(e) =>
                        handleUpdateItem(item.id, "unit_price", parseFloat(e.target.value) || 0)
                      }
                      className="w-28"
                    />
                  </TableCell>
                  <TableCell className="font-medium">${item.subtotal.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Totals */}
        <div className="p-6 border-t">
          <div className="flex flex-col items-end space-y-2 max-w-md ml-auto">
            <div className="flex justify-between w-full">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-medium">${formData.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between w-full items-center gap-4">
              <span className="text-muted-foreground">Shipping:</span>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formData.shipping}
                onChange={(e) =>
                  setFormData({ ...formData, shipping: parseFloat(e.target.value) || 0 })
                }
                className="w-32 text-right"
              />
            </div>
            <div className="flex justify-between w-full items-center gap-4">
              <span className="text-muted-foreground">Tax:</span>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formData.tax}
                onChange={(e) =>
                  setFormData({ ...formData, tax: parseFloat(e.target.value) || 0 })
                }
                className="w-32 text-right"
              />
            </div>
            <div className="flex justify-between w-full pt-2 border-t">
              <span className="font-semibold">Total:</span>
              <span className="font-semibold text-lg">${formData.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Email Recipients */}
      <div className="bg-card rounded-lg border p-6 space-y-4">
        <Label>Email Recipients</Label>
        <div className="flex gap-2">
          <Input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddEmail()}
            placeholder="Enter email address"
          />
          <Button onClick={handleAddEmail} variant="outline">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.email_recipients.map((email) => (
            <Badge key={email} variant="secondary" className="gap-2">
              {email}
              <button
                onClick={() => handleRemoveEmail(email)}
                className="hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t p-4 flex justify-end gap-4 z-10">
        <Button variant="outline" onClick={onBack}>
          Cancel
        </Button>
        <Button variant="outline" onClick={() => onSave(formData, "draft")}>
          Save Draft
        </Button>
        <Button onClick={() => onSave(formData, "preview")}>
          Preview Quote
        </Button>
      </div>

      <ItemPickerModal
        open={showItemPicker}
        onOpenChange={() => setShowItemPicker(false)}
        onAddItems={handleAddItems}
        selectedItemIds={[]}
      />
    </div>
  );
};
