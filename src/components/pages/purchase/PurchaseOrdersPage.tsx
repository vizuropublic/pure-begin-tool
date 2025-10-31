import { PageHeader } from "@/components/ui/page-header";

const PurchaseOrdersPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Orders"
        description="Create and track purchase orders"
      />
      
      <div className="bg-card rounded-lg border border-border p-6">
        <p className="text-muted-foreground">Purchase orders functionality will be implemented here.</p>
      </div>
    </div>
  );
};

export default PurchaseOrdersPage;
