import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background" dir="rtl">
      <div className="text-center space-y-6 p-6">
        <Heart className="h-20 w-20 text-primary mx-auto" />
        <h1 className="text-6xl font-bold text-foreground">404</h1>
        <p className="text-2xl text-muted-foreground">الصفحة غير موجودة</p>
        <p className="text-muted-foreground">الصفحة التي تبحث عنها غير متوفرة</p>
        <Link href="/">
          <Button size="lg" data-testid="button-home">
            العودة للرئيسية
          </Button>
        </Link>
      </div>
    </div>
  );
}
