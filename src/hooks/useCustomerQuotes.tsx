import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { mockQuotes, mockQuoteItems } from "@/data/mockQuotes";
import { mockCustomers } from "@/data/mockCustomers";

export interface CustomerQuote {
  id: string;
  quote_number: string;
  quote_date: string;
  expire_date: string;
  customer_id: string | null;
  reference: string | null;
  sales_person: string | null;
  subject: string | null;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: string;
  email_recipients: string[] | null;
  created_at: string;
  updated_at: string;
  customers?: {
    id: string;
    first_name: string;
    last_name: string;
    company_name: string | null;
    email: string | null;
  } | null;
}

export interface QuoteItem {
  id: string;
  quote_id: string;
  item_id: string | null;
  item_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  sort_order: number;
  created_at: string;
}

export interface Customer {
  id: string;
  customer_number: string;
  customer_type: string;
  salutation: string | null;
  first_name: string;
  last_name: string;
  company_name: string | null;
  email: string | null;
  work_phone: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const useCustomerQuotes = () => {
  const { toast } = useToast();
  const [quotes, setQuotes] = useState<CustomerQuote[]>(mockQuotes);

  const createQuote = (quoteData: any) => {
    const newQuote: CustomerQuote = {
      ...quoteData,
      id: `quote-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setQuotes([newQuote, ...quotes]);
    toast({
      title: "Success",
      description: "Quote created successfully",
    });
  };

  const updateQuote = ({ id, ...quoteData }: any) => {
    setQuotes(quotes.map(q => q.id === id ? { ...q, ...quoteData, updated_at: new Date().toISOString() } : q));
    toast({
      title: "Success",
      description: "Quote updated successfully",
    });
  };

  const deleteQuote = (id: string) => {
    setQuotes(quotes.filter(q => q.id !== id));
    toast({
      title: "Success",
      description: "Quote deleted successfully",
    });
  };

  return {
    quotes,
    isLoading: false,
    error: null,
    createQuote,
    updateQuote,
    deleteQuote,
  };
};

export const useQuoteItems = (quoteId: string | null) => {
  const [items, setItems] = useState<QuoteItem[]>(
    quoteId ? mockQuoteItems.filter(i => i.quote_id === quoteId) : []
  );

  const saveItems = ({ quoteId, items: newItems }: { quoteId: string; items: any[] }) => {
    const formattedItems = newItems.map((item, index) => ({
      ...item,
      id: item.id || `qitem-${Date.now()}-${index}`,
      quote_id: quoteId,
      sort_order: index,
      created_at: new Date().toISOString(),
    }));
    setItems(formattedItems);
  };

  return {
    items,
    isLoading: false,
    saveItems,
  };
};

export const useCustomers = () => {
  return {
    data: mockCustomers,
    isLoading: false,
    error: null,
  };
};
