import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UserRole } from "../pages/Index";
import { 
  Home, 
  Package, 
  Bell,
  BarChart3,
  Users,
  Settings,
  FileText,
  User,
  X,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  ShoppingCart as ShoppingCartIcon,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useState } from "react";

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  children?: MenuItem[];
}

interface SidebarProps {
  userRole: UserRole;
  activeMenu: string;
  onMenuSelect: (menu: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  isCollapsed?: boolean;
  onCollapse?: () => void;
}

const getMenuItems = (role: UserRole): MenuItem[] => {
  return [
    { id: "Home", label: "Home", icon: Home },
    { id: "Inventory", label: "Inventory", icon: Package },
    { 
      id: "Sales", 
      label: "Sales", 
      icon: ShoppingBag,
      children: [
        { id: "Customers", label: "Customers", icon: Users },
        { id: "CustomerQuotes", label: "Customer Quotes", icon: FileText },
        { id: "CustomerOrders", label: "Customer Orders", icon: ShoppingCartIcon },
        { id: "SalesInvoices", label: "Sales Invoices", icon: FileText },
        { id: "PaymentReceived", label: "Payment Received", icon: BarChart3 },
      ]
    },
    { 
      id: "Purchase", 
      label: "Purchase", 
      icon: ShoppingCartIcon,
      children: [
        { id: "Vendors", label: "Vendors", icon: Users },
        { id: "VendorQuotes", label: "Vendor Quotes", icon: FileText },
        { id: "PurchaseOrders", label: "Purchase Orders", icon: ShoppingCartIcon },
        { id: "PurchaseInvoices", label: "Purchase Invoices", icon: FileText },
        { id: "PaymentMade", label: "Payment Made", icon: BarChart3 },
      ]
    },
    { id: "MonthlyReport", label: "Monthly Report", icon: BarChart3 },
  ];
};

const Sidebar = ({ userRole, activeMenu, onMenuSelect, isOpen, onToggle, isCollapsed = false, onCollapse }: SidebarProps) => {
  const menuItems = getMenuItems(userRole);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["Sales", "Purchase"]);

  const toggleExpanded = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus.includes(item.id);
    const isActive = activeMenu === item.id;

    if (hasChildren) {
      return (
        <div key={item.id} className="space-y-1">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-left h-10",
              "text-card-foreground hover:bg-muted",
              isCollapsed ? "lg:px-2 lg:justify-center" : "",
              level > 0 && "pl-8"
            )}
            onClick={() => toggleExpanded(item.id)}
            title={isCollapsed ? item.label : undefined}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <Icon className={cn("h-5 w-5 flex-shrink-0", !isCollapsed ? "mr-3" : "lg:mr-0")} />
                <span className={cn("truncate", isCollapsed ? "lg:hidden" : "")}>
                  {item.label}
                </span>
              </div>
              {!isCollapsed && (
                isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </Button>
          
          {isExpanded && !isCollapsed && (
            <div className="space-y-1 ml-4">
              {item.children?.map(child => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Button
        key={item.id}
        variant={isActive ? "default" : "ghost"}
        className={cn(
          "w-full justify-start text-left h-10",
          isActive 
            ? "bg-primary text-primary-foreground hover:bg-primary/90" 
            : "text-card-foreground hover:bg-muted",
          isCollapsed ? "lg:px-2 lg:justify-center" : "",
          level > 0 && "pl-8"
        )}
        onClick={() => {
          onMenuSelect(item.id);
          if (window.innerWidth < 1024) {
            onToggle();
          }
        }}
        title={isCollapsed ? item.label : undefined}
      >
        <div className="flex items-center">
          <Icon className={cn("h-5 w-5 flex-shrink-0", !isCollapsed ? "mr-3" : "lg:mr-0")} />
          <span className={cn("truncate", isCollapsed ? "lg:hidden" : "")}>
            {item.label}
          </span>
        </div>
      </Button>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "inset-y-0 left-0 z-50 bg-card border-r border-border h-full transition-all duration-200 ease-in-out",
        "fixed lg:static",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "w-64 lg:translate-x-0",
        isCollapsed ? "lg:w-16" : "lg:w-64"
      )}>
        <div className="flex flex-col h-full">
          {/* Close button for mobile */}
          <div className="flex items-center justify-between p-4 lg:hidden border-b border-border">
            <h2 className="font-semibold text-card-foreground">Menu</h2>
            <Button variant="ghost" size="sm" onClick={onToggle}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map(item => renderMenuItem(item))}
          </nav>
          
          {/* Collapse/Expand button for desktop */}
          {onCollapse && (
            <div className="hidden lg:flex justify-end p-2 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={onCollapse}
                className="h-8 w-8 p-0"
                title={isCollapsed ? "Expand Menu" : "Collapse Menu"}
              >
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
