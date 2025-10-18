import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function UsersManagement() {
  const [searchQuery, setSearchQuery] = useState("");

  const users = [
    {
      id: "1",
      name: "د. محمد أحمد",
      email: "mohamed@clinic.com",
      role: "doctor",
      phone: "+966 50 123 4567",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "أحمد علي",
      email: "ahmed@patient.com",
      role: "patient",
      phone: "+966 55 234 5678",
      createdAt: "2024-02-20",
    },
    {
      id: "3",
      name: "فاطمة خالد",
      email: "fatima@clinic.com",
      role: "accountant",
      phone: "+966 56 345 6789",
      createdAt: "2024-03-10",
    },
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-500/10 text-purple-700 dark:text-purple-300">مدير</Badge>;
      case "doctor":
        return <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-300">طبيب</Badge>;
      case "accountant":
        return <Badge className="bg-orange-500/10 text-orange-700 dark:text-orange-300">محاسب</Badge>;
      case "patient":
        return <Badge className="bg-cyan-500/10 text-cyan-700 dark:text-cyan-300">مريض</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">إدارة المستخدمين</h1>
            <p className="text-muted-foreground text-lg">عرض وتعديل حسابات المستخدمين</p>
          </div>
          <Button data-testid="button-add-user">
            <Plus className="h-4 w-4 ml-2" />
            إضافة مستخدم
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">البحث والفلترة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="ابحث عن مستخدم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pr-12"
                data-testid="input-search-users"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">المستخدم</TableHead>
                  <TableHead className="text-right">البريد الإلكتروني</TableHead>
                  <TableHead className="text-right">الهاتف</TableHead>
                  <TableHead className="text-right">الدور</TableHead>
                  <TableHead className="text-right">تاريخ التسجيل</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="hover-elevate" data-testid={`user-${user.id}`}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{user.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" data-testid={`button-edit-${user.id}`}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" data-testid={`button-delete-${user.id}`}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
