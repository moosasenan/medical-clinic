import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, TrendingUp, CheckCircle, XCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function DoctorDashboard() {
  const stats = [
    {
      title: "المرضى اليوم",
      value: "8",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "الأرباح هذا الأسبوع",
      value: "4,500 ريال",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-500/10",
    },
  ];

  const appointments = [
    {
      id: "1",
      patient: "أحمد محمد",
      time: "10:00 AM",
      status: "pending",
      notes: "فحص دوري",
    },
    {
      id: "2",
      patient: "فاطمة علي",
      time: "11:30 AM",
      status: "confirmed",
      notes: "استشارة",
    },
    {
      id: "3",
      patient: "خالد سعيد",
      time: "2:00 PM",
      status: "pending",
      notes: "متابعة",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">قيد الانتظار</Badge>;
      case "confirmed":
        return <Badge className="bg-green-500/10 text-green-700 dark:text-green-300">مؤكد</Badge>;
      case "completed":
        return <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-300">مكتمل</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">لوحة تحكم الطبيب</h1>
          <p className="text-muted-foreground text-lg">مواعيد اليوم وإحصائياتك</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">مواعيد اليوم</CardTitle>
            <Calendar className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="p-6 border rounded-lg space-y-4 hover-elevate transition-all"
                data-testid={`appointment-${appointment.id}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {appointment.patient.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-lg">{appointment.patient}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{appointment.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(appointment.status)}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                {appointment.status === "pending" && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      data-testid={`button-accept-${appointment.id}`}
                    >
                      <CheckCircle className="h-4 w-4 ml-2" />
                      قبول
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1"
                      data-testid={`button-reject-${appointment.id}`}
                    >
                      <XCircle className="h-4 w-4 ml-2" />
                      رفض
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
