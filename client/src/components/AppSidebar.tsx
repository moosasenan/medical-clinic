import { Home, Users, Stethoscope, Calendar, DollarSign, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();

  const getMenuItems = () => {
    if (user?.role === "admin") {
      return [
        { title: "لوحة التحكم", url: "/admin", icon: Home },
        { title: "المستخدمون", url: "/admin/users", icon: Users },
        { title: "التخصصات", url: "/admin/specialties", icon: Stethoscope },
        { title: "المواعيد", url: "/admin/appointments", icon: Calendar },
        { title: "الإعدادات", url: "/admin/settings", icon: Settings },
      ];
    } else if (user?.role === "doctor") {
      return [
        { title: "لوحة التحكم", url: "/doctor", icon: Home },
        { title: "المواعيد", url: "/doctor/appointments", icon: Calendar },
        { title: "الملف الشخصي", url: "/doctor/profile", icon: Users },
      ];
    } else if (user?.role === "accountant") {
      return [
        { title: "لوحة التحكم", url: "/accountant", icon: Home },
        { title: "المدفوعات", url: "/accountant/payments", icon: DollarSign },
        { title: "التقارير", url: "/accountant/reports", icon: Calendar },
      ];
    }
    return [];
  };

  const menuItems = getMenuItems();

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getRoleBadgeColor = () => {
    switch (user?.role) {
      case "admin":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-300";
      case "doctor":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-300";
      case "accountant":
        return "bg-orange-500/10 text-orange-700 dark:text-orange-300";
      default:
        return "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300";
    }
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case "admin":
        return "مدير";
      case "doctor":
        return "طبيب";
      case "accountant":
        return "محاسب";
      default:
        return "مريض";
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-6 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user?.name ? getInitials(user.name) : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate" data-testid="text-user-name">
              {user?.name}
            </p>
            <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor()}`}>
              {getRoleLabel()}
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>القائمة الرئيسية</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`link-${item.url.split("/").pop()}`}
                  >
                    <a href={item.url} onClick={(e) => { e.preventDefault(); setLocation(item.url); }}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start hover-elevate active-elevate-2"
          onClick={handleLogout}
          data-testid="button-logout"
        >
          <LogOut className="h-4 w-4 ml-2" />
          تسجيل الخروج
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
