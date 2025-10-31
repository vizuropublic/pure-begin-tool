import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRole } from "@/pages/Index";
import { Package, FileText, TrendingUp, DollarSign, Calendar, Users } from "lucide-react";
import { mockInventory } from "@/data/mockInventory";
import { mockOrders } from "@/data/mockOrders";

interface HomePageProps {
  userRole: UserRole;
}

const HomePage = ({ userRole }: HomePageProps) => {
  const getWelcomeMessage = () => {
    return "Welcome to CoreHub ERP System";
  };

  const [stats, setStats] = useState([
    { title: "Total Inventory", value: "...", icon: Package, color: "text-blue-600" },
    { title: "Sales Orders", value: "...", icon: FileText, color: "text-green-600" },
    { title: "Purchase Orders", value: "...", icon: TrendingUp, color: "text-orange-600" },
    { title: "Monthly Revenue", value: "...", icon: DollarSign, color: "text-purple-600" },
  ]);

  // Get total inventory count
  const getTotalInventoryCount = async () => {
    return mockInventory.length;
  };

  // Get sales orders count (this month)
  const getSalesOrdersCount = async () => {
    return mockOrders.length;
  };

  // Get purchase orders count (placeholder - will be implemented later)
  const getPurchaseOrdersCount = async () => {
    return "0";
  };

  const getMonthlyRevenue = async () => {
    const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total_amount, 0);
    return `USD ${totalRevenue.toLocaleString()}`;
  };

  useEffect(() => {
    const fetchStats = async () => {
      const inventoryCount = await getTotalInventoryCount();
      const salesOrdersCount = await getSalesOrdersCount();
      const purchaseOrdersCount = await getPurchaseOrdersCount();
      const monthlyRevenue = await getMonthlyRevenue();
      
      setStats(prevStats => [
        { ...prevStats[0], value: String(inventoryCount ?? 'N/A') },
        { ...prevStats[1], value: String(salesOrdersCount ?? 'N/A') },
        { ...prevStats[2], value: String(purchaseOrdersCount ?? 'N/A') },
        { ...prevStats[3], value: String(monthlyRevenue ?? 'N/A') },
      ]);
    };
    
    fetchStats();
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-4 sm:p-6 lg:p-8 text-primary-foreground">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">{getWelcomeMessage()}</h1>
        <p className="text-primary-foreground/80 text-sm sm:text-base">Comprehensive inventory, sales, and purchase management</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{stat.title}</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-card-foreground mt-1">{stat.value}</p>
                  </div>
                  <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${stat.color} flex-shrink-0`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base sm:text-lg">
              <Calendar className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <div className="w-2 h-2 bg-success rounded-full flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-card-foreground">New sales order created</p>
                  <p className="text-xs text-muted-foreground">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <div className="w-2 h-2 bg-info rounded-full flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-card-foreground">Inventory stock updated</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <div className="w-2 h-2 bg-warning rounded-full flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-card-foreground">Purchase order received</p>
                  <p className="text-xs text-muted-foreground">3 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base sm:text-lg">
              <Users className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium text-card-foreground">System Status</span>
                <span className="text-xs sm:text-sm text-success font-medium">Normal</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium text-card-foreground">Database Connection</span>
                <span className="text-xs sm:text-sm text-success font-medium">Normal</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium text-card-foreground">Last Backup</span>
                <span className="text-xs sm:text-sm text-muted-foreground">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium text-card-foreground">Online Users</span>
                <span className="text-xs sm:text-sm text-info font-medium">24</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
