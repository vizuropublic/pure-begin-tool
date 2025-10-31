import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { PageHeader } from "../../ui/page-header";

interface OrderManagementHeaderProps {
  onClearAllOrders: () => void;
}

export const OrderManagementHeader = ({ onClearAllOrders }: OrderManagementHeaderProps) => {
  return (
    <PageHeader
      title="Order Management"
      description="View and manage all orders"
    />
  );
};