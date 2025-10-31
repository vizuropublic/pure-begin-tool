import { ChevronRight } from "lucide-react";

interface OrderStatusProgressProps {
  status: string;
  cancellationReasons?: string[];
}

export const OrderStatusProgress = ({ status, cancellationReasons }: OrderStatusProgressProps) => {
  const getStatusDisplay = () => {
    if (status === "Cancelled") {
      const reasonText = cancellationReasons && cancellationReasons.length > 0 
        ? ` (${cancellationReasons.join(', ')})` 
        : "";
      return `Status: Cancelled${reasonText}`;
    }
    
    // Show progression for normal statuses
    const statusFlow = ["Pending", "Confirmed", "Completed"];
    const currentIndex = statusFlow.indexOf(status);
    
    if (currentIndex === -1) return `Status: ${status}`;
    
    // Show progression up to current status
    const progression = statusFlow.slice(0, currentIndex + 1).join(" → ");
    return `Status: ${progression}`;
  };

  return (
    <div className="mb-4">
      <p className="text-sm text-gray-600">{getStatusDisplay()}</p>
    </div>
  );
};