import { Routes, Route, Navigate } from "react-router-dom";
import { UserRole } from "../pages/Index";
import HomePage from "./pages/HomePage";
import InventoryManagementPage from "./pages/InventoryManagementPage";
import MonthlyReportPage from "./pages/MonthlyReportPage";

// Sales Pages
import CustomersPage from "./pages/sales/CustomersPage";
import CustomerQuotesPage from "./pages/sales/CustomerQuotesPage";
import CustomerOrdersPage from "./pages/sales/CustomerOrdersPage";
import SalesInvoicesPage from "./pages/sales/SalesInvoicesPage";
import PaymentReceivedPage from "./pages/sales/PaymentReceivedPage";

// Purchase Pages
import VendorsPage from "./pages/purchase/VendorsPage";
import VendorQuotesPage from "./pages/purchase/VendorQuotesPage";
import PurchaseOrdersPage from "./pages/purchase/PurchaseOrdersPage";
import PurchaseInvoicesPage from "./pages/purchase/PurchaseInvoicesPage";
import PaymentMadePage from "./pages/purchase/PaymentMadePage";

interface MainContentProps {
  userRole: UserRole;
}

const MainContent = ({ userRole }: MainContentProps) => {
  return (
    <main className="flex-1 h-full overflow-y-auto bg-background">
      <div className="w-full max-w-container mx-auto p-page">
        <Routes>
          <Route path="/" element={<HomePage userRole={userRole} />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/inventory" element={<InventoryManagementPage />} />
          
          {/* Sales Routes */}
          <Route path="/customers/*" element={<CustomersPage />} />
          <Route path="/customer-quotes" element={<CustomerQuotesPage />} />
          <Route path="/customer-orders" element={<CustomerOrdersPage />} />
          <Route path="/sales-invoices" element={<SalesInvoicesPage />} />
          <Route path="/payment-received" element={<PaymentReceivedPage />} />
          
          {/* Purchase Routes */}
          <Route path="/vendors" element={<VendorsPage />} />
          <Route path="/vendor-quotes" element={<VendorQuotesPage />} />
          <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
          <Route path="/purchase-invoices" element={<PurchaseInvoicesPage />} />
          <Route path="/payment-made" element={<PaymentMadePage />} />
          
          <Route path="/monthly-report" element={<MonthlyReportPage />} />
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </main>
  );
};

export default MainContent;
