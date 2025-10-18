import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Heart, Brain, Bone, Eye, Calendar, Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import type { Specialty, Appointment } from "@shared/schema";

export default function PatientDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  // Fetch specialties
  const { data: specialties, isLoading: isLoadingSpecialties } = useQuery<Specialty[]>({
    queryKey: ["/api/specialties"],
  });

  // Fetch appointments for current user
  const { data: appointments, isLoading: isLoadingAppointments } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"],
    enabled: !!user,
  });

  const upcomingAppointments = appointments?.filter(
    (apt) => apt.status === "confirmed" || apt.status === "pending"
  ) || [];

  const iconMap: Record<string, any> = {
    heart: Heart,
    brain: Brain,
    bone: Bone,
    eye: Eye,
  };

  const featuredDoctors = [
    {
      id: "1",
      name: "د. محمد أحمد",
      specialty: "القلب والأوعية الدموية",
      rating: 4.8,
      experience: 15,
      fee: 300,
    },
    {
      id: "2",
      name: "د. فاطمة علي",
      specialty: "الأعصاب",
      rating: 4.9,
      experience: 12,
      fee: 350,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500/10 text-green-700 dark:text-green-300">مؤكد</Badge>;
      case "pending":
        return <Badge variant="secondary">قيد الانتظار</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">أهلاً بك</h1>
          <p className="text-muted-foreground text-lg">ابحث عن الطبيب المناسب واحجز موعدك</p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="ابحث عن طبيب أو تخصص..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pr-12 text-lg"
                data-testid="input-search-doctors"
              />
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        {isLoadingAppointments ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">مواعيدك القادمة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="p-6 border rounded-lg">
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </CardContent>
          </Card>
        ) : upcomingAppointments.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">مواعيدك القادمة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingAppointments.map((appointment: any) => (
                <div
                  key={appointment.id}
                  className="p-6 border rounded-lg flex items-center justify-between hover-elevate"
                  data-testid={`appointment-${appointment.id}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{appointment.doctorName}</p>
                      <p className="text-sm text-muted-foreground">{appointment.specialtyName}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(appointment.appointmentDate).toLocaleDateString('ar')} - {new Date(appointment.appointmentDate).toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(appointment.status)}
                </div>
              ))}
            </CardContent>
          </Card>
        ) : null}

        {/* Specialties */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">التخصصات الطبية</h2>
          {isLoadingSpecialties ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-16 w-16 rounded-full mx-auto" />
                    <Skeleton className="h-6 w-32 mx-auto" />
                    <Skeleton className="h-4 w-24 mx-auto" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {specialties?.map((specialty) => {
                const Icon = iconMap[specialty.icon || "heart"] || Heart;
                return (
                  <Card
                    key={specialty.id}
                    className="hover-elevate cursor-pointer transition-all duration-200"
                    data-testid={`specialty-${specialty.id}`}
                  >
                    <CardContent className="p-6 text-center space-y-4">
                      <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                        <Icon className="h-8 w-8 text-accent-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{specialty.nameAr}</h3>
                        <p className="text-sm text-muted-foreground">{specialty.nameEn}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Featured Doctors */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">الأطباء المميزون</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDoctors.map((doctor) => (
              <Card
                key={doctor.id}
                className="hover-elevate transition-all duration-200"
                data-testid={`doctor-${doctor.id}`}
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                        {doctor.name.split(" ").slice(1, 3).map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{doctor.name}</CardTitle>
                      <CardDescription>{doctor.specialty}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{doctor.rating}</span>
                    </div>
                    <span className="text-muted-foreground">{doctor.experience} سنوات خبرة</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">{doctor.fee} ريال</span>
                    <Button size="sm" data-testid={`button-book-${doctor.id}`}>
                      احجز الآن
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
