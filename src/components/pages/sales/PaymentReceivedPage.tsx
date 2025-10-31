import { PageHeader } from "@/components/ui/page-header";

const PaymentReceivedPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment Received"
        description="Track payments received from customers"
      />
      
      <div className="bg-card rounded-lg border border-border p-6">
        <p className="text-muted-foreground">Payment received tracking will be implemented here.</p>
      </div>
    </div>
  );
};

export default PaymentReceivedPage;
