
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserRole } from "../../pages/Index";
import { Search, Plus, Edit, UserX, Users, Shield, User } from "lucide-react";
import { PageHeader } from "../ui/page-header";

interface UserManagementPageProps {
  userRole: UserRole;
}

const UserManagementPage = ({ userRole }: UserManagementPageProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const users = [
    {
      id: 1,
      name: "John Wang",
      email: "wang@example.com",
      role: "Remanufacturer Admin",
      status: "Active",
      lastLogin: "2024-01-18 14:30",
      department: "Management"
    },
    {
      id: 2,
      name: "Emily Li",
      email: "li@example.com",
      role: "Remanufacturer Agent",
      status: "Active",
      lastLogin: "2024-01-18 09:15",
      department: "Sales"
    },
    {
      id: 3,
      name: "David Zhang",
      email: "zhang@example.com",
      role: "Remanufacturer Agent",
      status: "Inactive",
      lastLogin: "2024-01-15 16:45",
      department: "Sales"
    },
    {
      id: 4,
      name: "Amy Chen",
      email: "chen@example.com",
      role: "Remanufacturer Agent",
      status: "Active",
      lastLogin: "2024-01-18 11:20",
      department: "Procurement"
    },
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    return status === "Active" 
      ? <Badge className="bg-green-100 text-green-800">Active</Badge>
      : <Badge className="bg-red-100 text-red-800">Inactive</Badge>;
  };

  const getRoleIcon = (role: string) => {
    return role.includes("Admin") 
      ? <Shield className="h-4 w-4 text-purple-600" />
      : <User className="h-4 w-4 text-blue-600" />;
  };

  const activeUsers = users.filter(u => u.status === "Active").length;
  const adminUsers = users.filter(u => u.role.includes("Admin")).length;

  return (
    <div className="space-y-content">
      <PageHeader
        title="User Management"
        description="Manage system users and permission settings"
      >
        {userRole === "Remanufacturer Admin" && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        )}
      </PageHeader>

      {/* Summary Cards */}
      <div className="grid gri

-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
              </div>
              <User className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Administrators</p>
                <p className="text-2xl font-bold text-purple-600">{adminUsers}</p>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by name, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="font-semibold text-lg">{user.name}</h3>
                      {getStatusBadge(user.status)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(user.role)}
                        <span>{user.role}</span>
                      </div>
                      <div>
                        <span className="font-medium">Department:</span>
                        {user.department}
                      </div>
                      <div>
                        <span className="font-medium">Last Login:</span>
                        {user.lastLogin}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                  </div>
                </div>
                
                {userRole === "Remanufacturer Admin" && (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="mr-1 h-4 w-4" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                      <UserX className="mr-1 h-4 w-4" />
                      Disable
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">No users found matching the criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserManagementPage;
