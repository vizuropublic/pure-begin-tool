import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { mockInventory } from '@/data/mockInventory';

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
  inventory_photo: InventoryPhoto[] | [];
}

export interface InventoryPhoto {
  id: string;
  inventory_id: string;
  file_path: string;
  file_name: string;
  file_type: string;
  description: string;
  is_primary: boolean;
  created_at: string;
  created_by: string;
}

export interface InventoryItemDisplay extends InventoryItem {
  price: string;
  updateDate: string;
  productId: string;
  image: string;
  // subcategory: string;
}

export const useInventory = () => {
  const [inventory, setInventory] = useState<InventoryItemDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Transform Supabase data to display format
  const transformToDisplay = (item: any): InventoryItemDisplay => ({
    ...item,
    price: `USD ${item.est_price.toLocaleString()}`,
    updateDate: new Date(item.updated_at).toLocaleDateString('en-CA'),
    productId: item.id.slice(0, 17), // Use first part of UUID as product ID
    image: "/placeholder.svg",
    // subcategory: item.subcategory || ""
  });

  // Transform display data back to Supabase format
  const transformFromDisplay = (item: Partial<InventoryItemDisplay>): Partial<InventoryItem> => {
    const result: Partial<InventoryItem> = { ...item };
    
    if (item.price) {
      result.est_price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
      delete (result as any).price;
    }
    
    delete (result as any).updateDate;
    delete (result as any).productId;
    delete (result as any).image;
    
    return result;
  };

  // Fetch all inventory items
  const fetchInventory = async () => {
    try {
      setLoading(true);
      const transformedData = mockInventory.map(transformToDisplay);
      setInventory(transformedData);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast({
        title: "Error Loading Inventory",
        description: "Failed to load inventory data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Update inventory item status
  const updateInventoryStatus = async (ids: string[], status: "available" | "listed" | "ordered" | "sold" | "deleted") => {
    setInventory(prev => prev.map(item => 
      ids.includes(item.id) ? { ...item, status, updated_at: new Date().toISOString(), updateDate: new Date().toLocaleDateString('en-CA') } : item
    ));
    return true;
  };

  // Add new inventory item
  const addInventoryItem = async (item: Partial<InventoryItemDisplay>) => {
    const transformedItem = transformFromDisplay(item);
    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      name: transformedItem.name || '',
      type: transformedItem.type || '',
      family: transformedItem.family || '',
      subcategory: transformedItem.subcategory || null,
      possibility: transformedItem.possibility || '',
      status: "available",
      est_price: transformedItem.est_price || 0,
      seller_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      comment: transformedItem.comment || null,
      remark: transformedItem.remark || null,
      source: transformedItem.source || '',
      location: transformedItem.location || '',
      make: transformedItem.make || null,
      inventory_photo: [],
    };
    
    const displayItem = transformToDisplay(newItem);
    setInventory(prev => [displayItem, ...prev]);
    return displayItem;
  };

  return {
    inventory,
    loading,
    fetchInventory,
    updateInventoryStatus,
    addInventoryItem,
    transformToDisplay,
    transformFromDisplay
  };
};