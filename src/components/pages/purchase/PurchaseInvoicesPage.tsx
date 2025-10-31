import { PageHeader } from "@/components/ui/page-header";

const PurchaseInvoicesPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Invoices"
        description="Process and manage purchase invoices"
      />
      
      <div className="bg-card rounded-lg border border-border p-6">
        <p className="text-muted-foreground">Purchase invoices functionality will be implemented here.</p>
      </div>
    </div>
  );
};

export default PurchaseInvoicesPage;
