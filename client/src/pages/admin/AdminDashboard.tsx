import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Stethoscope, Calendar, DollarSign } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    {
      title: "إجمالي المستخدمين",
      value: "1,234",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "الأطباء",
      value: "156",
      icon: Stethoscope,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "المواعيد اليوم",
      value: "48",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-500/10",
    },
    {
      title: "الإيرادات الشهرية",
      value: "125,000 ريال",
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">لوحة تحكم المدير</h1>
          <p className="text-muted-foreground text-lg">مرحباً بك في نظام إدارة العيادة</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover-elevate transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold" data-testid={`stat-${stat.title}`}>
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">آخر التسجيلات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 border rounded-lg hover-elevate">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">مستخدم جديد {i}</p>
                      <p className="text-sm text-muted-foreground">منذ {i} ساعات</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">المواعيد القادمة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 border rounded-lg hover-elevate">
                    <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">موعد {i}</p>
                      <p className="text-sm text-muted-foreground">اليوم {i + 2}:00 م</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
