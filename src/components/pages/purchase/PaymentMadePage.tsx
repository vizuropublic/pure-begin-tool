import { PageHeader } from "@/components/ui/page-header";

const PaymentMadePage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment Made"
        description="Track payments made to vendors"
      />
      
      <div className="bg-card rounded-lg border border-border p-6">
        <p className="text-muted-foreground">Payment made tracking will be implemented here.</p>
      </div>
    </div>
  );
};

export default PaymentMadePage;
