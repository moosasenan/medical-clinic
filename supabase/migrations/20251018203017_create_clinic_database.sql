/*
  # إنشاء قاعدة بيانات العيادة الطبية
  
  ## الجداول الجديدة
  
  ### 1. users (المستخدمون)
  - `id` (uuid, primary key)
  - `email` (text, unique) - البريد الإلكتروني
  - `password` (text) - كلمة المرور المشفرة
  - `name` (text) - الاسم
  - `role` (enum) - الدور: admin, doctor, patient, accountant
  - `phone` (text) - رقم الهاتف
  - `avatar` (text) - صورة الملف الشخصي
  - `created_at` (timestamp) - تاريخ الإنشاء
  
  ### 2. specialties (التخصصات الطبية)
  - `id` (uuid, primary key)
  - `name_ar` (text) - الاسم بالعربية
  - `name_en` (text) - الاسم بالإنجليزية
  - `description_ar` (text) - الوصف بالعربية
  - `description_en` (text) - الوصف بالإنجليزية
  - `icon` (text) - أيقونة التخصص
  - `created_at` (timestamp) - تاريخ الإنشاء
  
  ### 3. doctor_profiles (ملفات الأطباء)
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - معرف المستخدم
  - `specialty_id` (uuid, foreign key) - معرف التخصص
  - `description_ar` (text) - الوصف بالعربية
  - `description_en` (text) - الوصف بالإنجليزية
  - `experience` (integer) - سنوات الخبرة
  - `rating` (decimal) - التقييم
  - `consultation_fee` (decimal) - سعر الاستشارة
  - `created_at` (timestamp) - تاريخ الإنشاء
  
  ### 4. appointments (المواعيد)
  - `id` (uuid, primary key)
  - `patient_id` (uuid, foreign key) - معرف المريض
  - `doctor_id` (uuid, foreign key) - معرف الطبيب
  - `specialty_id` (uuid, foreign key) - معرف التخصص
  - `appointment_date` (timestamp) - تاريخ الموعد
  - `status` (enum) - الحالة: pending, confirmed, completed, cancelled
  - `notes` (text) - ملاحظات
  - `created_at` (timestamp) - تاريخ الإنشاء
  
  ### 5. payments (المدفوعات)
  - `id` (uuid, primary key)
  - `appointment_id` (uuid, foreign key) - معرف الموعد
  - `amount` (decimal) - المبلغ
  - `payment_method` (enum) - طريقة الدفع: cash, card, online
  - `paid_at` (timestamp) - تاريخ الدفع
  - `created_at` (timestamp) - تاريخ الإنشاء
  
  ## الأمان
  - تفعيل RLS على جميع الجداول
  - إضافة سياسات الأمان المناسبة لكل دور
*/

-- Create enums
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'doctor', 'patient', 'accountant');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM ('cash', 'card', 'online');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  name text NOT NULL,
  role user_role NOT NULL DEFAULT 'patient',
  phone text,
  avatar text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create specialties table
CREATE TABLE IF NOT EXISTS specialties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar text NOT NULL,
  name_en text NOT NULL,
  description_ar text,
  description_en text,
  icon text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create doctor_profiles table
CREATE TABLE IF NOT EXISTS doctor_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  specialty_id uuid NOT NULL REFERENCES specialties(id),
  description_ar text,
  description_en text,
  experience integer DEFAULT 0,
  rating decimal(3, 2) DEFAULT 0,
  consultation_fee decimal(10, 2) NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  specialty_id uuid NOT NULL REFERENCES specialties(id),
  appointment_date timestamptz NOT NULL,
  status appointment_status NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  amount decimal(10, 2) NOT NULL,
  payment_method payment_method NOT NULL,
  paid_at timestamptz DEFAULT now() NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for specialties table (public read, admin write)
CREATE POLICY "Anyone can view specialties"
  ON specialties FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert specialties"
  ON specialties FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update specialties"
  ON specialties FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- RLS Policies for doctor_profiles table
CREATE POLICY "Anyone can view doctor profiles"
  ON doctor_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Doctors can update their own profile"
  ON doctor_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage doctor profiles"
  ON doctor_profiles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- RLS Policies for appointments table
CREATE POLICY "Patients can view their appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Doctors can view their appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (doctor_id = auth.uid());

CREATE POLICY "Admins can view all appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Patients can create appointments"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Doctors can update their appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (doctor_id = auth.uid())
  WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Admins can manage all appointments"
  ON appointments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- RLS Policies for payments table
CREATE POLICY "Users can view their payment records"
  ON payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = payments.appointment_id
      AND (appointments.patient_id = auth.uid() OR appointments.doctor_id = auth.uid())
    )
  );

CREATE POLICY "Admins and accountants can view all payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role IN ('admin', 'accountant')
    )
  );

CREATE POLICY "Admins and accountants can create payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role IN ('admin', 'accountant')
    )
  );

CREATE POLICY "Admins and accountants can update payments"
  ON payments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role IN ('admin', 'accountant')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role IN ('admin', 'accountant')
    )
  );
