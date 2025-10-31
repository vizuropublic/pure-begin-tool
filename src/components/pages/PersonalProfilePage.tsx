import { UserRole } from "@/pages/Index";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Building, Calendar, Edit, Save, X } from "lucide-react";
import { PageHeader } from "../ui/page-header";

interface PersonalProfilePageProp {
  userRole: UserRole;
}

const PersonalProfilePage = ({ userRole }: PersonalProfilePageProp) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Generate random avatar color
  const avatarColor = useMemo(() => {
    const hue = Math.floor(Math.random() * 360);
    const bgColor = `hsl(${hue}, 70%, 90%)`;
    const textColor = `hsl(${hue}, 70%, 40%)`;
    return { bgColor, textColor };
  }, []);
  
  const [profile, setProfile] = useState({
    name: "John Wang",
    email: "wang@example.com",
    phone: "0912-345-678",
    department: "Management",
    position: "System Administrator",
    joinDate: "2023-03-15",
    lastLogin: "2024-01-18 14:30",
    role: userRole
  });

  const [editedProfile, setEditedProfile] = useState(profile);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const activityHistory = [
    { action: "System Login", time: "2024-01-18 14:30", status: "Success" },
    { action: "Update Product Info", time: "2024-01-18 11:20", status: "Success" },
    { action: "Create New Order", time: "2024-01-17 16:45", status: "Success" },
    { action: "System Login", time: "2024-01-17 09:15", status: "Success" },
    { action: "Modify User Permissions", time: "2024-01-16 14:30", status: "Success" },
  ];

  return (
    <div className="space-y-content">
      <PageHeader
        title="Personal Profile"
        description="View and edit your personal information"
      >
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} variant="default">
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
            <Button onClick={handleCancel} variant="outline">
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        )}
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-6">
                <Avatar className="h-20 w-20">
                  <AvatarFallback 
                    className="text-2xl font-bold"
                    style={{ 
                      backgroundColor: avatarColor.bgColor, 
                      color: avatarColor.textColor 
                    }}
                  >
                    {profile.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{profile.name}</h2>
                  <p className="text-gray-600">{profile.role}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Name
                    </Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={editedProfile.name}
                        onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{profile.name}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email
                    </Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editedProfile.email}
                        onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{profile.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Phone Number
                    </Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editedProfile.phone}
                        onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{profile.phone}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="department" className="text-sm font-medium text-gray-700">
                      Department
                    </Label>
                    {isEditing ? (
                      <Input
                        id="department"
                        value={editedProfile.department}
                        onChange={(e) => setEditedProfile({...editedProfile, department: e.target.value})}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{profile.department}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="position" className="text-sm font-medium text-gray-700">
                      Position
                    </Label>
                    {isEditing ? (
                      <Input
                        id="position"
                        value={editedProfile.position}
                        onChange={(e) => setEditedProfile({...editedProfile, position: e.target.value})}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{profile.position}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Join Date
                    </Label>
                    <p className="mt-1 text-gray-900">{profile.joinDate}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity and Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Last Login</span>
                <span className="text-sm text-gray-900">{new Date().toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Account Status</span>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Permission Level</span>
                <span className="text-sm text-gray-900">Administrator</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityHistory.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PersonalProfilePage;
