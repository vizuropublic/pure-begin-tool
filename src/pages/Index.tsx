import { Routes, Route } from "react-router-dom";
import LoginPage from "../components/LoginPage";
import Dashboard from "../components/Dashboard";
import { NotificationProvider } from "../contexts/NotificationContext";
import { useAuth } from "../hooks/useAuth";

export type UserRole = "Vendor Admin" | "Remanufacturer Admin" | "Remanufacturer Agent";

// Map database roles to application roles
const mapDatabaseRoleToUserRole = (dbRole: string): UserRole => {
  switch (dbRole) {
    case 'seller':
      return "Vendor Admin";
    case 'buyer':
      return "Remanufacturer Admin";
    case 'agent':
      return "Remanufacturer Agent";
    case 'admin':
      return "Vendor Admin"; // Admins get full access
    default:
      return "Remanufacturer Agent"; // Default fallback
  }
};

const Index = () => {
  const { user, userProfile, isLoading, signOut } = useAuth();

  const handleLogin = () => {
    // Login is handled by AuthContext, no need for manual state management
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">載入中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Use default role if userProfile is still loading
  const userRole = userProfile ? mapDatabaseRoleToUserRole(userProfile.role) : "Remanufacturer Agent";

  return (
    <NotificationProvider>
      <Routes>
        <Route path="/*" element={<Dashboard userRole={userRole} onLogout={signOut} />} />
      </Routes>
    </NotificationProvider>
  );
};

export default Index;
