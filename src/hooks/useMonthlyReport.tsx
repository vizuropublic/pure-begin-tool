import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { mockOrders } from "@/data/mockOrders";

export interface InventoryItem {
  id: string;
  name: string;
  type: string;
  family: string;
  subcategory: string | null;
  possibility: string;
  status: "available" | "listed" | "ordered" | "sold" | "deleted";
  est_price: number;
  seller_id: string | null;
  created_at: string;
  updated_at: string;
  comment: string | null;
  remark: string | null;
  source: string;
  location: string;
  make: string | null;
  inventory_photo: Array<{ id: number; file_path: string; is_primary: boolean; inventory_id: string; }>;
}

export interface OrderItem {
  id: string;
  order_id: string;
  inventory_id: string;
  quantity: number;
  unit_price: number;
  created_at: string;
  updated_at: string;
  inventory: InventoryItem;
}

export interface Order {
  id: string;
  order_number: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  ordering_staff: {
    name: string;
    email: string;
  };
  seller_id: {
    name: string;
    email: string;
  } | null;
  ordering_time: string;
  update_time: string;
  items_number: number;
  total_quantity: number;
  total_amount: number;
  cancellation_reason: string[] | null;
  delivery_name: string;
  delivery_address: string;
  order_items: OrderItem[];
}

export const useMonthlyReport = () => {
    const [orders] = useState<Order[]>([]);
    const [monthlyTotalSales, setMonthlyTotalSales] = useState<number | null>(185000);
    const [completedOrders, setCompletedOrders] = useState<number | null>(2);
    const [averageOrderValue, setAverageOrderValue] = useState<number | null>(92500);
    const [annualGrowthRate, setAnnualGrowthRate] = useState<number | null>(15.5);
    const [loading] = useState(false);
    const { toast } = useToast();

    const fetchOrders = async (date: Date) => {
        // Mock implementation
        console.log('Fetching orders for date:', date);
    };

    const fetchMonthlyReport = async () => {
        // Mock implementation
        console.log('Fetching monthly report');
    };

    const fetchCurrentMonthlyTotalSales = async () => {
        setMonthlyTotalSales(185000);
    };

    const fetchMonthlyTotalSales = async (date: Date) => {
        setMonthlyTotalSales(185000);
    };

    const fetchCompletedOrderCount = async (date: Date = new Date()) => {
        setCompletedOrders(2);
    };

    const fetchAverageOrderValue = async (date: Date = new Date()) => {
        setAverageOrderValue(92500);
    };

    const fetchAnnualGrowthRate = async (date: Date = new Date()) => {
        setAnnualGrowthRate(15.5);
    }

    return {
        orders,
        monthlyTotalSales,
        completedOrders,
        averageOrderValue,
        annualGrowthRate,
        loading,
        setOrders: () => {},
        setMonthlyTotalSales,
        setCompletedOrders,
        setAverageOrderValue,
        setAnnualGrowthRate,
        setLoading: () => {},
        fetchMonthlyTotalSales,
        fetchCompletedOrderCount,
        fetchAverageOrderValue,
        fetchAnnualGrowthRate,
        fetchOrders
    };
};
