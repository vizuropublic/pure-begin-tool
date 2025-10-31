import { useState } from "react";
import { toast } from "sonner";
import { mockCustomers } from "@/data/mockCustomers";

export interface Customer {
  id: string;
  customer_number: string;
  customer_type: string;
  salutation?: string;
  first_name: string;
  last_name: string;
  company_name?: string;
  work_phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [isLoading] = useState(false);

  const createCustomer = (newCustomer: Omit<Customer, "id" | "customer_number" | "created_at" | "updated_at">) => {
    const customer: Customer = {
      ...newCustomer,
      id: `cus-${Date.now()}`,
      customer_number: `CUS-${String(customers.length + 1).padStart(5, '0')}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setCustomers([customer, ...customers]);
    toast.success("Customer created successfully");
  };

  const updateCustomer = ({ id, ...updates }: Partial<Customer> & { id: string }) => {
    setCustomers(customers.map(c => c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c));
    toast.success("Customer updated successfully");
  };

  const deleteCustomer = (id: string) => {
    setCustomers(customers.filter(c => c.id !== id));
    toast.success("Customer deleted successfully");
  };

  return {
    customers,
    isLoading,
    error: null,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  };
};

export const useCustomer = (id: string) => {
  const customer = mockCustomers.find(c => c.id === id);
  return {
    data: customer,
    isLoading: false,
    error: null,
  };
};
