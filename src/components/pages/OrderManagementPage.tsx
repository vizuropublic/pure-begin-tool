import { useState } from "react";
import { UserRole } from "../../pages/Index";
import { useOrderManagement } from "../../hooks/useOrderManagement";
import { OrderManagementHeader } from "./order-management/OrderManagementHeader";
import { OrderFilters } from "./order-management/OrderFilters";
import { DateFilter } from "./order-management/DateFilter";
import { OrderList } from "./order-management/OrderList";
import { StatusChangeDialog } from "./order-management/StatusChangeDialog";
import { CancellationDialog } from "./order-management/CancellationDialog";

interface OrderManagementPageProps {
  userRole: UserRole;
}

const OrderManagementPage = ({ userRole }: OrderManagementPageProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const {
    orders,
    expandedOrders,
    editingOrder,
    isStatusDialogOpen,
    pendingStatusChange,
    isCancellationDialogOpen,
    cancellationReasons,
    customCancellationReason,
    setEditingOrder,
    setIsStatusDialogOpen,
    setIsCancellationDialogOpen,
    setCancellationReasons,
    setCustomCancellationReason,
    clearAllOrders,
    toggleOrderExpansion,
    handleStatusChange,
    confirmStatusChange,
    confirmCancellation,
    removeItemFromOrder
  } = useOrderManagement();

  const filteredOrders = orders.filter(order => {
    const matchesSearch = String(order.order_number).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.ordering_staff?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    // Month filtering
    let matchesDateRange = true;
    if (startDate || endDate) {
      const orderDate = new Date(order.ordering_time);
      if (startDate) {
        const start = new Date(startDate + '-01');
        matchesDateRange = matchesDateRange && orderDate >= start;
      }
      if (endDate) {
        const end = new Date(endDate + '-01');
        end.setMonth(end.getMonth() + 1);
        end.setDate(0); // Last day of the month
        end.setHours(23, 59, 59, 999);
        matchesDateRange = matchesDateRange && orderDate <= end;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDateRange;
  }).sort((a, b) => {
    // Sort by createdAt time, latest first (newest to oldest)
    const dateA = new Date(a.ordering_time);
    const dateB = new Date(b.ordering_time);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-shrink-0 space-y-4 sm:space-y-6">
        <OrderManagementHeader onClearAllOrders={clearAllOrders} />

        <OrderFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        <DateFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
      </div>

      {/* Scrollable Orders List */}
      <div className="flex-1 pt-6 overflow-y-auto min-h-0">
        <OrderList
          orders={filteredOrders}
          userRole={userRole}
          expandedOrders={expandedOrders}
          editingOrder={editingOrder}
          toggleOrderExpansion={toggleOrderExpansion}
          setEditingOrder={setEditingOrder}
          handleStatusChange={handleStatusChange}
          removeItemFromOrder={removeItemFromOrder}
        />
      </div>

      <StatusChangeDialog
        isOpen={isStatusDialogOpen}
        onOpenChange={setIsStatusDialogOpen}
        pendingStatusChange={pendingStatusChange}
        onConfirm={confirmStatusChange}
      />

      <CancellationDialog
        isOpen={isCancellationDialogOpen}
        onOpenChange={setIsCancellationDialogOpen}
        cancellationReasons={cancellationReasons}
        setCancellationReasons={setCancellationReasons}
        customCancellationReason={customCancellationReason}
        setCustomCancellationReason={setCustomCancellationReason}
        onConfirm={confirmCancellation}
      />
    </div>
  );
};

export default OrderManagementPage;