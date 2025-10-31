import { PageHeader } from "@/components/ui/page-header";

const CustomerOrdersPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Orders"
        description="Track and manage customer orders"
      />
      
      <div className="bg-card rounded-lg border border-border p-6">
        <p className="text-muted-foreground">Customer orders functionality will be implemented here.</p>
      </div>
    </div>
  );
};

export default CustomerOrdersPage;
