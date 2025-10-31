
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Shield, Key, User, CreditCard } from "lucide-react";
import { PageHeader } from "../ui/page-header";

const AccountManagementPage = () => {
  return (
    <div className="space-y-content">
      <PageHeader
        title="Account Management"
        description="Manage your account settings and permissions"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Basic Account Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Account Type</label>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">Enterprise Account</Badge>
                <Badge variant="outline">Verified</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Account Status</label>
              <Badge variant="default" className="bg-green-500">Active</Badge>
            </div>
            <Button variant="outline" className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Permission Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Order Management</span>
                <Badge variant="default">Full Access</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Inventory Management</span>
                <Badge variant="default">Full Access</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">User Management</span>
                <Badge variant="default">Full Access</Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Manage Permissions
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountManagementPage;
