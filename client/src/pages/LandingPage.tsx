import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Heart, Calendar, Users, TrendingUp, Stethoscope, Activity } from "lucide-react";
import heroImage from "@assets/generated_images/Doctor_consulting_with_patient_5e1bfdfd.png";

export default function LandingPage() {
  const features = [
    {
      icon: Calendar,
      titleAr: "حجز المواعيد",
      titleEn: "Appointment Booking",
      descAr: "احجز موعدك مع أفضل الأطباء بسهولة",
      descEn: "Book appointments with top doctors easily",
    },
    {
      icon: Users,
      titleAr: "إدارة شاملة",
      titleEn: "Complete Management",
      descAr: "نظام متكامل للأطباء والمرضى والإدارة",
      descEn: "Integrated system for doctors, patients, and admin",
    },
    {
      icon: TrendingUp,
      titleAr: "تحليلات ذكية",
      titleEn: "Smart Analytics",
      descAr: "تقارير مفصلة عن الأداء والإيرادات",
      descEn: "Detailed performance and revenue reports",
    },
  ];

  const specialties = [
    { icon: Heart, nameAr: "القلب", nameEn: "Cardiology" },
    { icon: Stethoscope, nameAr: "الباطنية", nameEn: "Internal Medicine" },
    { icon: Activity, nameAr: "الجلدية", nameEn: "Dermatology" },
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">العيادة الذكية</h1>
              <p className="text-xs text-muted-foreground">Smart Medical Clinic</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="outline" data-testid="button-login" className="hover-elevate active-elevate-2">
                تسجيل الدخول
              </Button>
            </Link>
            <Link href="/register">
              <Button data-testid="button-register">
                حساب جديد
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                  نظام إدارة العيادة الطبية الذكي
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  احجز موعدك مع أفضل الأطباء أونلاين. نظام متكامل لإدارة المواعيد الطبية والمرضى والمدفوعات
                </p>
              </div>
              <div className="flex gap-4 flex-wrap">
                <Link href="/register">
                  <Button size="lg" className="h-12 px-8" data-testid="button-get-started">
                    ابدأ الآن
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="h-12 px-8 hover-elevate active-elevate-2" data-testid="button-learn-more">
                    تسجيل الدخول
                  </Button>
                </Link>
              </div>
              <div className="flex gap-8 pt-4">
                <div>
                  <p className="text-3xl font-bold text-primary">500+</p>
                  <p className="text-sm text-muted-foreground">طبيب</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">10,000+</p>
                  <p className="text-sm text-muted-foreground">مريض</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">50,000+</p>
                  <p className="text-sm text-muted-foreground">موعد</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-primary/10 z-10"></div>
                <img
                  src={heroImage}
                  alt="Medical consultation"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">المميزات</h3>
            <p className="text-muted-foreground text-lg">نظام شامل لإدارة العيادة الطبية</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover-elevate transition-all duration-200 hover:shadow-md">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="text-xl font-semibold text-foreground">{feature.titleAr}</h4>
                  <p className="text-muted-foreground">{feature.descAr}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">التخصصات الطبية</h3>
            <p className="text-muted-foreground text-lg">اختر التخصص المناسب لك</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {specialties.map((specialty, index) => (
              <Card key={index} className="hover-elevate transition-all duration-200">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                    <specialty.icon className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground">{specialty.nameAr}</h4>
                  <p className="text-sm text-muted-foreground">{specialty.nameEn}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-muted-foreground">
            © 2024 العيادة الذكية. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  );
}
