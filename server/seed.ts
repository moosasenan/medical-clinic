import { storage } from "./storage";
import bcrypt from "bcrypt";
import { pool } from "./db";

const SALT_ROUNDS = 10;

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seed...");

    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", SALT_ROUNDS);
    const admin = await storage.createUser({
      email: "admin@clinic.com",
      password: adminPassword,
      name: "المدير العام",
      role: "admin",
      phone: "+966 50 111 1111",
    });
    console.log("✓ Created admin user");

    // Create specialties
    const cardiology = await storage.createSpecialty({
      nameAr: "القلب والأوعية الدموية",
      nameEn: "Cardiology",
      descriptionAr: "تشخيص وعلاج أمراض القلب والأوعية الدموية",
      descriptionEn: "Diagnosis and treatment of heart and vascular diseases",
      icon: "heart",
    });

    const neurology = await storage.createSpecialty({
      nameAr: "الأعصاب",
      nameEn: "Neurology",
      descriptionAr: "تشخيص وعلاج أمراض الجهاز العصبي",
      descriptionEn: "Diagnosis and treatment of nervous system disorders",
      icon: "brain",
    });

    const orthopedics = await storage.createSpecialty({
      nameAr: "العظام",
      nameEn: "Orthopedics",
      descriptionAr: "تشخيص وعلاج أمراض العظام والمفاصل",
      descriptionEn: "Diagnosis and treatment of bone and joint disorders",
      icon: "bone",
    });

    console.log("✓ Created specialties");

    // Create doctor users
    const doctor1Password = await bcrypt.hash("doctor123", SALT_ROUNDS);
    const doctor1 = await storage.createUser({
      email: "doctor1@clinic.com",
      password: doctor1Password,
      name: "د. محمد أحمد",
      role: "doctor",
      phone: "+966 50 222 2222",
    });

    const doctor2Password = await bcrypt.hash("doctor123", SALT_ROUNDS);
    const doctor2 = await storage.createUser({
      email: "doctor2@clinic.com",
      password: doctor2Password,
      name: "د. فاطمة علي",
      role: "doctor",
      phone: "+966 50 333 3333",
    });

    console.log("✓ Created doctor users");

    // Create doctor profiles
    await storage.createDoctorProfile({
      userId: doctor1.id,
      specialtyId: cardiology.id,
      descriptionAr: "استشاري أمراض القلب مع خبرة 15 عام",
      descriptionEn: "Cardiology consultant with 15 years experience",
      experience: 15,
      consultationFee: "300",
    });

    await storage.createDoctorProfile({
      userId: doctor2.id,
      specialtyId: neurology.id,
      descriptionAr: "استشارية أمراض الأعصاب مع خبرة 12 عام",
      descriptionEn: "Neurology consultant with 12 years experience",
      experience: 12,
      consultationFee: "350",
    });

    console.log("✓ Created doctor profiles");

    // Create patient user
    const patientPassword = await bcrypt.hash("patient123", SALT_ROUNDS);
    const patient = await storage.createUser({
      email: "patient@clinic.com",
      password: patientPassword,
      name: "أحمد محمود",
      role: "patient",
      phone: "+966 55 444 4444",
    });

    console.log("✓ Created patient user");

    // Create accountant user
    const accountantPassword = await bcrypt.hash("accountant123", SALT_ROUNDS);
    const accountant = await storage.createUser({
      email: "accountant@clinic.com",
      password: accountantPassword,
      name: "خالد السعيد",
      role: "accountant",
      phone: "+966 56 555 5555",
    });

    console.log("✓ Created accountant user");

    // Create sample appointment
    const appointment = await storage.createAppointment({
      patientId: patient.id,
      doctorId: doctor1.id,
      specialtyId: cardiology.id,
      appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      status: "pending",
      notes: "فحص دوري للقلب",
    });

    console.log("✓ Created sample appointment");

    // Create sample payment
    await storage.createPayment({
      appointmentId: appointment.id,
      amount: "300",
      paymentMethod: "card",
    });

    console.log("✓ Created sample payment");

    console.log("\n🎉 Database seeded successfully!");
    console.log("\nTest credentials:");
    console.log("Admin: admin@clinic.com / admin123");
    console.log("Doctor: doctor1@clinic.com / doctor123");
    console.log("Patient: patient@clinic.com / patient123");
    console.log("Accountant: accountant@clinic.com / accountant123");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Execute seed when script is run directly
seedDatabase()
  .then(() => {
    console.log("\n✅ Seed completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Seed failed:", error);
    process.exit(1);
  });
