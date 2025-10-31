import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Truck, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { PageHeader } from "../ui/page-header";

const WishListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const shipments = [
    {
      id: "SHIP-2024-001",
      orderId: "ORD-2024-001",
      customer: "ABC Company",
      items: [
        { name: "Electronic Component A", quantity: 2 },
        { name: "Mechanical Part B", quantity: 1 }
      ],
      status: "Delivered",
      trackingNumber: "TW1234567890",
      estimatedDelivery: "2024-01-20",
      actualDelivery: "2024-01-19"
    },
    {
      id: "SHIP-2024-002",
      orderId: "ORD-2024-002",
      customer: "XYZ Enterprise",
      items: [
        { name: "Plastic Mold C", quantity: 3 },
        { name: "Metal Material D", quantity: 2 }
      ],
      status: "In Transit",
      trackingNumber: "TW0987654321",
      estimatedDelivery: "2024-01-22",
      actualDelivery: null
    },
    {
      id: "SHIP-2024-003",
      orderId: "ORD-2024-003",
      customer: "DEF Factory",
      items: [
        { name: "Chemical Raw Material E", quantity: 1 }
      ],
      status: "Preparing",
      trackingNumber: null,
      estimatedDelivery: "2024-01-25",
      actualDelivery: null
    },
    {
      id: "SHIP-2024-004",
      orderId: "ORD-2024-004",
      customer: "GHI Manufacturing",
      items: [
        { name: "Electronic Component A", quantity: 5 },
        { name: "Mechanical Part B", quantity: 3 }
      ],
      status: "Delayed",
      trackingNumber: "TW1122334455",
      estimatedDelivery: "2024-01-18",
      actualDelivery: null
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      "Delivered": { bg: "bg-green-100", text: "text-green-800", icon: CheckCircle },
      "In Transit": { bg: "bg-blue-100", text: "text-blue-800", icon: Truck },
      "Preparing": { bg: "bg-yellow-100", text: "text-yellow-800", icon: Clock },
      "Delayed": { bg: "bg-red-100", text: "text-red-800", icon: AlertCircle },
    };
    
    const style = statusStyles[status as keyof typeof statusStyles] || statusStyles["Preparing"];
    const Icon = style.icon;
    
    return (
      <Badge className={`${style.bg} ${style.text} flex items-center space-x-1`}>
        <Icon className="h-3 w-3" />
        <span>{status}</span>
      </Badge>
    );
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || shipment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusCounts = () => {
    return {
      total: shipments.length,
      delivered: shipments.filter(s => s.status === "Delivered").length,
      inTransit: shipments.filter(s => s.status === "In Transit").length,
      preparing: shipments.filter(s => s.status === "Preparing").length,
      delayed: shipments.filter(s => s.status === "Delayed").length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-content">
      <PageHeader
        title="Shipping Confirmation"
        description="Track and manage shipping status"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{statusCounts.total}</p>
              <p className="text-sm text-gray-600">Total Shipments</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{statusCounts.delivered}</p>
              <p className="text-sm text-gray-600">Delivered</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{statusCounts.inTransit}</p>
              <p className="text-sm text-gray-600">In Transit</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{statusCounts.preparing}</p>
              <p className="text-sm text-gray-600">Preparing</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{statusCounts.delayed}</p>
              <p className="text-sm text-gray-600">Delayed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by shipment ID, order ID, or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="In Transit">In Transit</SelectItem>
                <SelectItem value="Preparing">Preparing</SelectItem>
                <SelectItem value="Delayed">Delayed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Shipments List */}
      <div className="space-y-4">
        {filteredShipments.map((shipment) => (
          <Card key={shipment.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="font-semibold text-lg">{shipment.id}</h3>
                    {getStatusBadge(shipment.status)}
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Order: </span>{shipment.orderId}</p>
                    <p><span className="font-medium">Customer: </span>{shipment.customer}</p>
                    {shipment.trackingNumber && (
                      <p><span className="font-medium">Tracking: </span>{shipment.trackingNumber}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Items List</h4>
                  <div className="space-y-1">
                    {shipment.items.map((item, index) => (
                      <p key={index} className="text-sm text-gray-600">
                        {item.name} × {item.quantity}
                      </p>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Delivery Info</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Estimated: </span>{shipment.estimatedDelivery}</p>
                    {shipment.actualDelivery && (
                      <p><span className="font-medium">Actual: </span>{shipment.actualDelivery}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  {shipment.trackingNumber && (
                    <Button variant="outline" size="sm">
                      Track Package
                    </Button>
                  )}
                  {shipment.status === "Preparing" && (
                    <Button variant="outline" size="sm" className="text-blue-600">
                      Confirm Shipment
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredShipments.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Truck className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p className="text-gray-500">No shipment records found matching the criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WishListPage;