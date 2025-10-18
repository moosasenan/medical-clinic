import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, CreditCard, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AccountantDashboard() {
  const stats = [
    {
      title: "إجمالي الإيرادات",
      value: "125,000 ريال",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-500/10",
      change: "+12.5%",
    },
    {
      title: "المدفوعات اليوم",
      value: "8,500 ريال",
      icon: CreditCard,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
      change: "+8.2%",
    },
    {
      title: "متوسط قيمة الموعد",
      value: "300 ريال",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-500/10",
      change: "+5.1%",
    },
  ];

  const recentPayments = [
    {
      id: "1",
      patient: "أحمد محمد",
      doctor: "د. فاطمة علي",
      amount: 300,
      method: "card",
      date: "2024-10-18",
      time: "10:30 AM",
    },
    {
      id: "2",
      patient: "سارة خالد",
      doctor: "د. محمد أحمد",
      amount: 350,
      method: "cash",
      date: "2024-10-18",
      time: "11:00 AM",
    },
    {
      id: "3",
      patient: "عمر سعيد",
      doctor: "د. خالد سعيد",
      amount: 280,
      method: "online",
      date: "2024-10-18",
      time: "2:00 PM",
    },
  ];

  const getPaymentMethodBadge = (method: string) => {
    switch (method) {
      case "cash":
        return <Badge variant="secondary">نقدي</Badge>;
      case "card":
        return <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-300">بطاقة</Badge>;
      case "online":
        return <Badge className="bg-green-500/10 text-green-700 dark:text-green-300">أونلاين</Badge>;
      default:
        return <Badge variant="secondary">{method}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">لوحة المحاسبة</h1>
            <p className="text-muted-foreground text-lg">تقارير المدفوعات والإيرادات</p>
          </div>
          <Button data-testid="button-export-report">
            <Download className="h-4 w-4 ml-2" />
            تصدير التقرير
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <div className="text-3xl font-bold mb-2" data-testid={`stat-${stat.title}`}>
                  {stat.value}
                </div>
                <p className={`text-sm ${stat.color}`}>{stat.change} من الشهر الماضي</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">المدفوعات الأخيرة</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">المريض</TableHead>
                  <TableHead className="text-right">الطبيب</TableHead>
                  <TableHead className="text-right">المبلغ</TableHead>
                  <TableHead className="text-right">طريقة الدفع</TableHead>
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-right">الوقت</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPayments.map((payment) => (
                  <TableRow key={payment.id} className="hover-elevate" data-testid={`payment-${payment.id}`}>
                    <TableCell className="font-medium">{payment.patient}</TableCell>
                    <TableCell>{payment.doctor}</TableCell>
                    <TableCell className="font-semibold text-green-600">
                      {payment.amount} ريال
                    </TableCell>
                    <TableCell>{getPaymentMethodBadge(payment.method)}</TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>{payment.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">توزيع طرق الدفع</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm">بطاقة</span>
                  </div>
                  <span className="font-semibold">45%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">أونلاين</span>
                  </div>
                  <span className="font-semibold">35%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-gray-500"></div>
                    <span className="text-sm">نقدي</span>
                  </div>
                  <span className="font-semibold">20%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">أرباح الأطباء</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["د. محمد أحمد", "د. فاطمة علي", "د. خالد سعيد"].map((doctor, index) => (
                  <div key={doctor} className="flex items-center justify-between p-4 border rounded-lg hover-elevate">
                    <span className="font-medium">{doctor}</span>
                    <span className="font-semibold text-primary">
                      {(5000 - index * 500).toLocaleString()} ريال
                    </span>
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
