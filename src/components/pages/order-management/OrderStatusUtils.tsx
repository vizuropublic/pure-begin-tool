import { UserRole } from "../../../pages/Index";

export const getStatusOptions = (userRole: UserRole, currentStatus: string) => {
  // Vendor Admin can: PENDING → CONFIRMED, PENDING → CANCELLED
  if (userRole === "Vendor Admin") {
    if (currentStatus === "Pending") {
      return ["Pending", "Confirmed", "Cancelled"];
    }
    return [currentStatus];
  } 
  // Remanufacturer Admin/Agent can: PENDING → CANCELLED, CONFIRMED → COMPLETED, CONFIRMED → CANCELLED
  else if (userRole === "Remanufacturer Admin" || userRole === "Remanufacturer Agent") {
    if (currentStatus === "Pending") {
      return ["Pending", "Cancelled"];
    } else if (currentStatus === "Confirmed") {
      return ["Confirmed", "Completed", "Cancelled"];
    }
    return [currentStatus];
  }
  
  return [currentStatus]; // Read-only for other roles
};