import { useParams, useNavigate } from "react-router-dom";
import { useCustomer } from "@/hooks/useCustomers";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const CustomerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: customer, isLoading } = useCustomer(id!);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Customer not found</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate("/customers")}
        >
          Back to Customers
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/customers")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          title={`${customer.first_name} ${customer.last_name}`}
          description={customer.customer_number}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-1">Customer Type</p>
              <p className="text-sm text-muted-foreground">{customer.customer_type}</p>
            </div>
            {customer.company_name && (
              <div>
                <p className="text-sm font-medium mb-1">Company</p>
                <p className="text-sm text-muted-foreground">{customer.company_name}</p>
              </div>
            )}
            {customer.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a
                  href={`mailto:${customer.email}`}
                  className="text-sm text-primary hover:underline"
                >
                  {customer.email}
                </a>
              </div>
            )}
            {customer.work_phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a
                  href={`tel:${customer.work_phone}`}
                  className="text-sm text-primary hover:underline"
                >
                  {customer.work_phone}
                </a>
              </div>
            )}
            {customer.address && (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <p className="text-sm text-muted-foreground">{customer.address}</p>
              </div>
            )}
            {customer.notes && (
              <div>
                <p className="text-sm font-medium mb-1">Notes</p>
                <p className="text-sm text-muted-foreground">{customer.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="quotes">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="quotes">Quotes</TabsTrigger>
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
              </TabsList>
              <TabsContent value="quotes" className="space-y-4 mt-4">
                <p className="text-sm text-muted-foreground">
                  No customer quotes found for this customer.
                </p>
              </TabsContent>
              <TabsContent value="invoices" className="space-y-4 mt-4">
                <p className="text-sm text-muted-foreground">
                  No sales invoices found for this customer.
                </p>
              </TabsContent>
              <TabsContent value="payments" className="space-y-4 mt-4">
                <p className="text-sm text-muted-foreground">
                  No payments received from this customer.
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
