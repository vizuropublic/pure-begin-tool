import { PageHeader } from "@/components/ui/page-header";

const SalesInvoicesPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Invoices"
        description="Generate and manage sales invoices"
      />
      
      <div className="bg-card rounded-lg border border-border p-6">
        <p className="text-muted-foreground">Sales invoices functionality will be implemented here.</p>
      </div>
    </div>
  );
};

export default SalesInvoicesPage;
