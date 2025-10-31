import { Routes, Route, useLocation } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { CustomersList } from "./customers/CustomersList";
import { NewCustomer } from "./customers/NewCustomer";
import { CustomerDetail } from "./customers/CustomerDetail";

const CustomersPage = () => {
  const location = useLocation();
  const isSubRoute = location.pathname !== "/customers" && !location.pathname.endsWith("/customers");

  // Don't show header on sub-routes
  if (isSubRoute) {
    return (
      <Routes>
        <Route path="new" element={<NewCustomer />} />
        <Route path=":id" element={<CustomerDetail />} />
      </Routes>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Manage your customer information and contacts"
      />
      
      <CustomersList />
    </div>
  );
};

export default CustomersPage;
