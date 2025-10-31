import { PageHeader } from "@/components/ui/page-header";

const VendorQuotesPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Vendor Quotes"
        description="Request and manage quotes from vendors"
      />
      
      <div className="bg-card rounded-lg border border-border p-6">
        <p className="text-muted-foreground">Vendor quotes functionality will be implemented here.</p>
      </div>
    </div>
  );
};

export default VendorQuotesPage;
