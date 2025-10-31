
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserRole } from "../pages/Index";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import NotificationCenter from "./NotificationCenter";
import { GlobalSearch } from "./GlobalSearch";
import { LogOut, Menu } from "lucide-react";

interface DashboardProps {
  userRole: UserRole;
  onLogout: () => void;
}

const Dashboard = ({ userRole, onLogout }: DashboardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Map URL paths to menu items
  const getActiveMenuFromPath = (path: string): string => {
    if (path === "/" || path === "/home") return "Home";
    if (path.startsWith("/inventory")) return "Inventory";
    if (path.startsWith("/customers")) return "Customers";
    if (path.startsWith("/customer-quotes")) return "CustomerQuotes";
    if (path.startsWith("/customer-orders")) return "CustomerOrders";
    if (path.startsWith("/sales-invoices")) return "SalesInvoices";
    if (path.startsWith("/payment-received")) return "PaymentReceived";
    if (path.startsWith("/vendors")) return "Vendors";
    if (path.startsWith("/vendor-quotes")) return "VendorQuotes";
    if (path.startsWith("/purchase-orders")) return "PurchaseOrders";
    if (path.startsWith("/purchase-invoices")) return "PurchaseInvoices";
    if (path.startsWith("/payment-made")) return "PaymentMade";
    if (path.startsWith("/monthly-report")) return "MonthlyReport";
    return "Home";
  };

  const [activeMenu, setActiveMenu] = useState(() => getActiveMenuFromPath(location.pathname));

  // Update active menu when location changes
  useEffect(() => {
    setActiveMenu(getActiveMenuFromPath(location.pathname));
  }, [location.pathname]);

  // Map menu items to URL paths
  const getPathFromMenu = (menu: string): string => {
    const menuMap: Record<string, string> = {
      Home: "/",
      Inventory: "/inventory",
      Customers: "/customers",
      CustomerQuotes: "/customer-quotes",
      CustomerOrders: "/customer-orders",
      SalesInvoices: "/sales-invoices",
      PaymentReceived: "/payment-received",
      Vendors: "/vendors",
      VendorQuotes: "/vendor-quotes",
      PurchaseOrders: "/purchase-orders",
      PurchaseInvoices: "/purchase-invoices",
      PaymentMade: "/payment-made",
      MonthlyReport: "/monthly-report",
    };
    return menuMap[menu] || "/";
  };

  const handleMenuSelect = (menu: string) => {
    const path = getPathFromMenu(menu);
    navigate(path);
  };

  // Get initial sidebar state - for mobile only (desktop is always visible)
  const getInitialSidebarState = () => {
    const isDesktop = window.innerWidth >= 1024;
    if (isDesktop) {
      return true; // Desktop sidebar is always "open" (visibility controlled by collapse state)
    }
    // Mobile: check saved state or default to closed
    try {
      const savedState = localStorage.getItem('sidebarOpen');
      return savedState ? JSON.parse(savedState) : false;
    } catch {
      return false;
    }
  };

  const getInitialCollapseState = () => {
    try {
      const savedState = localStorage.getItem('sidebarCollapsed');
      return savedState ? JSON.parse(savedState) : false; // Default to expanded
    } catch {
      return false;
    }
  };

  // Use lazy initial state to avoid flickering
  const [sidebarOpen, setSidebarOpen] = useState(() => getInitialSidebarState());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => getInitialCollapseState());

  const handleNotificationClick = (orderId?: string) => {
    if (orderId) {
      // Navigate to customer orders and highlight the specific order
      navigate("/customer-orders");
      console.log(`Navigating to order: ${orderId}`);
    }
  };

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 1024;
      
      if (isDesktop) {
        // Desktop: sidebar is always "open" (controlled by collapse state)
        setSidebarOpen(true);
      } else {
        // Mobile: close sidebar when switching from desktop to mobile
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);


  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <Sidebar 
        userRole={userRole} 
        activeMenu={activeMenu} 
        onMenuSelect={handleMenuSelect}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        isCollapsed={sidebarCollapsed}
        onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <header className="bg-card shadow-sm border-b px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0 min-h-[var(--header-height)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-foreground truncate">CoreHub</h1>
                <p className="text-xs sm:text-sm text-muted-foreground truncate hidden sm:block">{userRole}</p>
              </div>
            </div>

            {/* Global Search - Center (Desktop) */}
            <div className="flex-1 max-w-2xl mx-4 hidden md:block">
              <GlobalSearch
                currentPage={activeMenu}
                onSearch={(searchTerm, scope, filters) => {
                  console.log("Search:", { searchTerm, scope, filters });
                  // TODO: Implement actual search functionality
                }}
              />
            </div>
            
            <div className="flex items-center space-x-1 sm:space-x-4">
              <NotificationCenter onNotificationClick={handleNotificationClick} />
              <Button 
                onClick={onLogout}
                variant="outline" 
                size="sm"
                className="flex items-center space-x-1 sm:space-x-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Mobile Search Bar */}
        <div className="md:hidden bg-card border-b px-4 py-2">
          <GlobalSearch
            currentPage={activeMenu}
            onSearch={(searchTerm, scope, filters) => {
              console.log("Search:", { searchTerm, scope, filters });
              // TODO: Implement actual search functionality
            }}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <MainContent userRole={userRole} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
