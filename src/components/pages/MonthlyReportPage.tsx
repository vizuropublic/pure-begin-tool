import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, DollarSign, Package, Download } from "lucide-react";
import { PageHeader } from "../ui/page-header";
import { useMonthlyReport } from "@/hooks/useMonthlyReport";  

const MonthlyReportPage = () => {
const {
    orders,
    monthlyTotalSales,
    completedOrders,
    averageOrderValue,
    annualGrowthRate,
    loading,
        setOrders,
        setMonthlyTotalSales,
        setCompletedOrders,
        setAverageOrderValue,
        setAnnualGrowthRate,
    setLoading,
    fetchOrders,
    fetchMonthlyTotalSales,
    fetchCompletedOrderCount,
    fetchAverageOrderValue,
    fetchAnnualGrowthRate
  } = useMonthlyReport();

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  // Generate last 6 months options
  const getMonthOptions = () => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 6; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      options.push({ value, label });
    }
    return options;
  };

  useEffect(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const dateForMonth = (new Date(year, month - 1, 2));

    const fetchAllDataForMonth = async () => {
      try {
        await Promise.all([
          fetchMonthlyTotalSales(dateForMonth),
          fetchCompletedOrderCount(dateForMonth),
          fetchAverageOrderValue(dateForMonth),
          fetchAnnualGrowthRate(dateForMonth),
          fetchOrders(dateForMonth),
        ]);
      } catch (e) {
        console.error(e);
      }
    };

    fetchAllDataForMonth();
  }, [selectedMonth]);

  return (
    <div className="space-y-content">
      <PageHeader
        title="Monthly Report"
        description="View monthly sales and order statistics"
      >
        <div className="flex items-center gap-4">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {getMonthOptions().map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">USD {(monthlyTotalSales?.toFixed(2))?.replace(/(\d)(?=(\d{3})+\.\d\d$)/g,"$1,")|| 'N/A'}</div>
            <p className="text-xs text-muted-foreground">Monthly total sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedOrders || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">Completed this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">USD {averageOrderValue?.toFixed(2).replace(/(\d)(?=(\d{3})+\.\d\d$)/g,"$1,") || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">Average per order</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{annualGrowthRate !== null ? `${annualGrowthRate > 0 ? '+' : ''}${annualGrowthRate.toFixed(1)}%` : 'N/A'}</div>
            <p className="text-xs text-muted-foreground">Monthly growth</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Completed Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Completed Date</TableHead>
                <TableHead>Ordering Staff</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.order_number}</TableCell>
                  <TableCell>{(new Date(order.update_time)).toLocaleString()}</TableCell>
                  <TableCell>{typeof order.ordering_staff?.name === 'string' ? order.ordering_staff?.name : 'Unknown User'}</TableCell>
                  <TableCell>{order.total_quantity}</TableCell>
                  <TableCell>USD {order.total_amount?.toLocaleString() || 0}</TableCell>
                  <TableCell>
                    <Badge className="bg-blue-500 hover:bg-blue-600">
                      {order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
};

export default MonthlyReportPage;