# Design Guidelines: Smart Medical Clinic Management System

## Design Approach
**Selected Approach:** Professional Healthcare Design System
**Justification:** Healthcare management requires trust, clarity, and efficiency. Drawing inspiration from leading medical platforms like Epic MyChart, Zocdoc, and Practo, combined with Material Design principles for information-dense applications.

## Core Design Principles
- **Trust First:** Professional, clinical aesthetic that builds confidence
- **Role Clarity:** Distinct visual identities for each user type while maintaining system cohesion
- **Information Hierarchy:** Clear data presentation for medical professionals
- **Accessibility:** WCAG AA compliance minimum for healthcare context

## Color Palette

### Light Mode
**Primary (Medical Blue):** 210 85% 45% - Professional, trustworthy medical blue
**Primary Hover:** 210 85% 38%
**Secondary (Success Green):** 142 70% 45% - For confirmations, available slots
**Accent (Clinical Teal):** 185 65% 48% - For highlights, interactive elements
**Background:** 0 0% 98% - Soft white, reduces eye strain
**Surface:** 0 0% 100% - Pure white cards
**Text Primary:** 220 15% 20% - Dark blue-gray for readability
**Text Secondary:** 220 10% 50%
**Border:** 220 15% 90%

### Dark Mode
**Primary:** 210 75% 55%
**Background:** 220 20% 12%
**Surface:** 220 18% 16%
**Text Primary:** 220 10% 95%
**Border:** 220 15% 25%

### Role-Specific Accent Colors
- **Admin:** 280 60% 50% (Purple) - Authority and control
- **Doctor:** 210 85% 45% (Blue) - Primary medical color
- **Patient:** 200 70% 50% (Cyan) - Friendly, approachable
- **Accountant:** 35 85% 50% (Orange) - Financial, analytical

## Typography
**Primary Font:** Inter (Google Fonts) - Excellent readability for medical data
**Secondary Font:** Inter (same family for consistency)

**Scale:**
- Hero/Dashboard Titles: text-4xl (2.25rem) font-bold
- Section Headers: text-2xl (1.5rem) font-semibold
- Card Headers: text-xl (1.25rem) font-semibold
- Body Text: text-base (1rem) font-normal
- Captions/Labels: text-sm (0.875rem) font-medium
- Small Print: text-xs (0.75rem) font-normal

## Layout System
**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-4, p-6
- Card spacing: p-6, p-8
- Section margins: my-8, my-12
- Grid gaps: gap-4, gap-6

**Container Strategy:**
- Max width: max-w-7xl (1280px) for dashboards
- Content max: max-w-4xl for forms and reading content
- Sidebar width: w-64 (256px) for navigation

## Component Library

### Navigation
**Top Bar (All Roles):**
- Height: h-16
- Logo left, user profile right
- Role badge with color coding
- Notification bell with badge counter
- Language switcher dropdown

**Sidebar (Admin/Doctor/Accountant):**
- Fixed left, full height
- Grouped menu items with icons
- Active state: colored left border (4px) + tinted background
- Collapsible on mobile

### Cards & Containers
**Dashboard Cards:**
- White background with subtle shadow (shadow-sm)
- Rounded corners: rounded-lg
- Padding: p-6
- Border: border border-gray-200 (light mode)
- Hover: shadow-md transition

**Stat Cards:**
- Icon + Number + Label layout
- Large numbers: text-3xl font-bold
- Role-specific accent colors for icons
- Grid layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6

### Forms
**Input Fields:**
- Height: h-12
- Border: 2px border
- Focus: Blue ring, ring-2 ring-blue-500
- Labels: Above inputs, text-sm font-medium
- Dark mode: Maintain visibility with proper backgrounds

**Buttons:**
- Primary: Role-colored, h-11, px-6, rounded-lg, font-medium
- Secondary: Outlined, same dimensions
- Sizes: Small (h-9), Default (h-11), Large (h-12)

### Tables (Critical for Medical Data)
- Alternating row colors for readability
- Fixed header on scroll
- Action columns (right-aligned)
- Status badges: pill-shaped with colored backgrounds
- Responsive: card layout on mobile

### Appointment Components
**Appointment Cards:**
- Patient photo/initial avatar (left)
- Time prominently displayed
- Status badge (Pending/Confirmed/Completed/Cancelled)
- Quick actions: Accept/Reject/View Details
- Color-coded left border by status

**Calendar View:**
- Week/Month toggle
- Time slots in 30-minute increments
- Booked slots: colored blocks with patient name
- Available slots: light background, clickable
- Drag-and-drop for rescheduling (doctor/admin)

### Analytics Dashboards
**Charts:**
- Line charts for trends (appointments over time)
- Bar charts for comparisons (doctor performance)
- Pie charts for distributions (payment methods)
- Color palette: Use role accent colors with opacity variants

### Modals & Overlays
- Backdrop: bg-black/50
- Modal: max-w-2xl, rounded-xl, shadow-2xl
- Close button: top-right, gray
- Actions: Bottom-right, Primary + Secondary buttons

## Images

### Hero Section (Landing/Login Page)
**Large Hero Image:** Yes
- Medical professional consulting with patient (warm, trustworthy)
- Placement: Right side (60% width) on desktop, top on mobile
- Treatment: Subtle overlay (blue tint at 10% opacity)
- Ensures text readability without darkening image too much

### Dashboard Images
- Doctor profile photos: Circular, w-12 h-12 (small), w-24 h-24 (profile page)
- Specialty icons: Custom medical icons for each specialty (Cardiology, Dermatology, etc.)
- Empty states: Friendly illustrations (appointment calendar, medical charts)

### Specialty Cards (Patient View)
- Each specialty has a representative icon or small image
- Grid layout: 3 columns on desktop
- Image size: h-32, object-cover, rounded-t-lg

## Animations
**Minimal and Purposeful:**
- Page transitions: Fade (200ms)
- Button hover: Scale 1.02, shadow increase (150ms)
- Modal open/close: Fade + scale (200ms)
- Loading states: Spinner or skeleton screens (not elaborate animations)
- Notification toasts: Slide from top-right (300ms)

## Accessibility
- All interactive elements: min h-11 (44px) touch target
- Color contrast: Minimum 4.5:1 for text
- Focus indicators: Visible ring on all inputs/buttons
- ARIA labels for icons and complex interactions
- Keyboard navigation: Full support
- Dark mode: Consistent across all form inputs, dropdowns, and text fields

## Role-Specific Design Notes

**Admin Dashboard:**
- System health indicators at top
- 4-column stat grid (users, appointments, revenue, alerts)
- Recent activity feed (right sidebar)
- Quick action buttons prominently placed

**Doctor Dashboard:**
- Today's appointments as primary focus (left 2/3)
- Quick stats: Patients today, This week earnings (top cards)
- Upcoming appointments in timeline format
- Patient notes quick access

**Patient Interface:**
- Search doctors/specialties (prominent search bar)
- Featured doctors carousel
- Available appointments calendar
- Past appointments history (table format)

**Accountant Dashboard:**
- Revenue charts (primary focus)
- Payment method breakdown (pie chart)
- Transaction table (filterable, sortable)
- Export buttons (PDF/Excel) - top-right

This design system prioritizes trust, clarity, and efficiency—essential for healthcare management while maintaining a modern, professional aesthetic.