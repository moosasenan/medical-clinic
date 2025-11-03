import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, Heart, Brain, Bone, Eye } from "lucide-react";

export default function SpecialtiesManagement() {
  const [searchQuery, setSearchQuery] = useState("");

  const specialties = [
    {
      id: "1",
      nameAr: "القلب والأوعية الدموية",
      nameEn: "Cardiology",
      icon: Heart,
      descriptionAr: "تشخيص وعلاج أمراض القلب والأوعية الدموية",
      descriptionEn: "Diagnosis and treatment of heart and vascular diseases",
      doctorCount: 12,
    },
    {
      id: "2",
      nameAr: "الأعصاب",
      nameEn: "Neurology",
      icon: Brain,
      descriptionAr: "تشخيص وعلاج أمراض الجهاز العصبي",
      descriptionEn: "Diagnosis and treatment of nervous system disorders",
      doctorCount: 8,
    },
    {
      id: "3",
      nameAr: "العظام",
      nameEn: "Orthopedics",
      icon: Bone,
      descriptionAr: "تشخيص وعلاج أمراض العظام والمفاصل",
      descriptionEn: "Diagnosis and treatment of bone and joint disorders",
      doctorCount: 15,
    },
    {
      id: "4",
      nameAr: "العيون",
      nameEn: "Ophthalmology",
      icon: Eye,
      descriptionAr: "تشخيص وعلاج أمراض العيون",
      descriptionEn: "Diagnosis and treatment of eye diseases",
      doctorCount: 10,
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">إدارة التخصصات</h1>
            <p className="text-muted-foreground text-lg">إضافة وتعديل التخصصات الطبية</p>
          </div>
          <Button data-testid="button-add-specialty">
            <Plus className="h-4 w-4 ml-2" />
            إضافة تخصص
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">البحث</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="ابحث عن تخصص..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12"
              data-testid="input-search-specialties"
            />
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialties.map((specialty) => (
            <Card key={specialty.id} className="hover-elevate transition-all" data-testid={`specialty-${specialty.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-14 w-14 rounded-lg bg-accent/10 flex items-center justify-center">
                      <specialty.icon className="h-7 w-7 text-accent-foreground" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{specialty.nameAr}</CardTitle>
                      <p className="text-sm text-muted-foreground">{specialty.nameEn}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{specialty.descriptionAr}</p>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm text-muted-foreground">
                    {specialty.doctorCount} طبيب
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" data-testid={`button-edit-${specialty.id}`}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" data-testid={`button-delete-${specialty.id}`}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
