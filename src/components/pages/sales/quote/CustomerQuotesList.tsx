import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { format } from "date-fns";

interface CustomerQuotesListProps {
  quotes: any[];
  isLoading: boolean;
  onNewQuote: () => void;
  onViewQuote: (id: string) => void;
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    Draft: "bg-muted text-muted-foreground",
    Quoting: "bg-info/10 text-info",
    Accepted: "bg-success/10 text-success",
    Declined: "bg-destructive/10 text-destructive",
    Invoiced: "bg-primary/10 text-primary",
    Expired: "bg-muted text-muted-foreground",
  };
  return colors[status] || "bg-muted text-muted-foreground";
};

export const CustomerQuotesList = ({
  quotes,
  isLoading,
  onNewQuote,
  onViewQuote,
}: CustomerQuotesListProps) => {

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex justify-end">
        <Button onClick={onNewQuote} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Quote
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quote #</TableHead>
              <TableHead>Create Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Company Name</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Loading quotes...
                </TableCell>
              </TableRow>
            ) : quotes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No quotes found
                </TableCell>
              </TableRow>
            ) : (
              quotes.map((quote) => (
                <TableRow
                  key={quote.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onViewQuote(quote.id)}
                >
                  <TableCell className="font-medium">{quote.quote_number}</TableCell>
                  <TableCell>{format(new Date(quote.quote_date), "MMM dd, yyyy")}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getStatusColor(quote.status)}>
                      {quote.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {quote.customers
                      ? `${quote.customers.first_name} ${quote.customers.last_name}`
                      : "-"}
                  </TableCell>
                  <TableCell>{quote.customers?.company_name || "-"}</TableCell>
                  <TableCell className="text-right font-medium">
                    ${quote.total.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
