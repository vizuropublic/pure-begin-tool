import { Button } from "@/components/ui/button";
import { ArrowLeft, Send } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PreviewCustomerQuoteProps {
  quote: any;
  customer: any;
  items: any[];
  onBack: () => void;
  onSend: () => void;
}

export const PreviewCustomerQuote = ({
  quote,
  customer,
  items,
  onBack,
  onSend,
}: PreviewCustomerQuoteProps) => {
  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Edit
        </Button>
        <Badge variant="secondary">Preview</Badge>
      </div>

      {/* Email Info */}
      <div className="bg-card rounded-lg border p-6 space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">To:</p>
          <p className="font-medium">{quote.email_recipients?.join(", ") || "No recipients"}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Subject:</p>
          <p className="font-medium">Quote {quote.quote_number} from CoreHub</p>
        </div>
      </div>

      {/* Quote Preview */}
      <div className="bg-white rounded-lg border shadow-sm">
        {/* Header */}
        <div className="p-8 border-b bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-foreground">QUOTATION</h1>
              <p className="text-lg text-muted-foreground mt-2">{quote.quote_number}</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-semibold text-foreground">CoreHub</h2>
              <p className="text-sm text-muted-foreground mt-1">Your Company Address</p>
              <p className="text-sm text-muted-foreground">Phone: (123) 456-7890</p>
              <p className="text-sm text-muted-foreground">Email: info@corehub.com</p>
            </div>
          </div>
        </div>

        {/* Customer & Quote Info */}
        <div className="p-8 grid grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-foreground mb-2">Quote To:</h3>
            <p className="font-medium text-foreground">
              {customer?.first_name} {customer?.last_name}
            </p>
            {customer?.company_name && (
              <p className="text-sm text-muted-foreground">{customer.company_name}</p>
            )}
            {customer?.email && (
              <p className="text-sm text-muted-foreground">{customer.email}</p>
            )}
            {customer?.work_phone && (
              <p className="text-sm text-muted-foreground">{customer.work_phone}</p>
            )}
          </div>
          <div className="text-right">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quote Date:</span>
                <span className="font-medium text-foreground">
                  {format(new Date(quote.quote_date), "MMM dd, yyyy")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Valid Until:</span>
                <span className="font-medium text-foreground">
                  {format(new Date(quote.expire_date), "MMM dd, yyyy")}
                </span>
              </div>
              {quote.reference && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reference:</span>
                  <span className="font-medium text-foreground">{quote.reference}</span>
                </div>
              )}
              {quote.sales_person && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sales Person:</span>
                  <span className="font-medium text-foreground">{quote.sales_person}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Subject */}
        {quote.subject && (
          <div className="px-8 pb-4">
            <p className="text-muted-foreground italic">{quote.subject}</p>
          </div>
        )}

        {/* Items Table */}
        <div className="px-8 pb-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">#</TableHead>
                <TableHead>Item Description</TableHead>
                <TableHead className="text-right w-24">Qty</TableHead>
                <TableHead className="text-right w-32">Unit Price</TableHead>
                <TableHead className="text-right w-32">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                  <TableCell className="font-medium text-foreground">{item.item_name}</TableCell>
                  <TableCell className="text-right text-foreground">{item.quantity}</TableCell>
                  <TableCell className="text-right text-foreground">
                    ${item.unit_price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-medium text-foreground">
                    ${item.subtotal.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Totals */}
        <div className="px-8 pb-8">
          <div className="flex flex-col items-end">
            <div className="w-80 space-y-2">
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium text-foreground">${quote.subtotal.toFixed(2)}</span>
              </div>
              {quote.shipping > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Shipping:</span>
                  <span className="font-medium text-foreground">${quote.shipping.toFixed(2)}</span>
                </div>
              )}
              {quote.tax > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Tax:</span>
                  <span className="font-medium text-foreground">${quote.tax.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between py-3 border-t-2 border-primary/20">
                <span className="text-lg font-semibold text-foreground">Total:</span>
                <span className="text-2xl font-bold text-primary">${quote.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-muted/30 border-t text-center">
          <p className="text-sm text-muted-foreground">
            Thank you for your business! This quote is valid until{" "}
            {format(new Date(quote.expire_date), "MMMM dd, yyyy")}.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            If you have any questions, please contact us at info@corehub.com
          </p>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t p-4 flex justify-end gap-4 z-10">
        <Button variant="outline" onClick={onBack}>
          Back to Edit
        </Button>
        <Button onClick={onSend}>
          <Send className="h-4 w-4 mr-2" />
          Send Quote
        </Button>
      </div>
    </div>
  );
};
