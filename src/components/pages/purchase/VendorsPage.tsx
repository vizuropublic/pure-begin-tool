import { PageHeader } from "@/components/ui/page-header";

const VendorsPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Vendors"
        description="Manage your vendor information and contacts"
      />
      
      <div className="bg-card rounded-lg border border-border p-6">
        <p className="text-muted-foreground">Vendor management functionality will be implemented here.</p>
      </div>
    </div>
  );
};

export default VendorsPage;
