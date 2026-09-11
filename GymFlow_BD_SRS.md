# Gym Website MVP — Software Requirements Specification (SRS)

## 1. Project Overview

### 1.1 Project Name
**GymFlow BD — Gym Membership & Management Platform**

### 1.2 Purpose

GymFlow BD is a production-oriented web application for a Bangladeshi gym. The MVP will allow visitors to learn about the gym, view membership plans, register as members, purchase memberships online through **SSLCOMMERZ**, and manage their memberships from a user dashboard.

An admin panel will allow gym staff to manage members, membership plans, payments, trainers, and core gym content.

### 1.3 Target Users

- **Visitors:** People who want to learn about the gym and its services.
- **Members:** Registered users who purchase and manage gym memberships.
- **Administrators:** Gym owners/managers who manage the system.

### 1.4 MVP Goal

The primary goal is to build a functional gym business platform that replaces a static gym website with:

- Online membership registration
- Online membership purchase
- SSLCOMMERZ payment integration
- Member dashboard
- Admin dashboard
- Member management
- Membership plan management
- Payment management
- Essential gym information and content

---

# 2. Scope

## 2.1 In Scope

The MVP will include:

1. Public gym website
2. User registration and login
3. User profile
4. Membership plans
5. Online membership purchase
6. SSLCOMMERZ payment integration
7. Payment verification
8. Membership activation
9. Member dashboard
10. Admin authentication
11. Admin dashboard
12. Member management
13. Membership plan management
14. Payment management
15. Trainer management
16. Gym facilities/services
17. Gallery
18. Contact information
19. FAQ
20. Basic notifications
21. Responsive design
22. Basic security and validation

## 2.2 Out of Scope for MVP

The following features may be added later:

- QR attendance/check-in
- Class booking
- Personal trainer booking
- Workout tracking
- Nutrition plans
- Mobile application
- SMS notifications
- Multi-branch management
- Advanced analytics
- Subscription auto-renewal
- AI features
- Loyalty/reward system
- Referral system

---

# 3. Functional Requirements

## 3.1 Public Website

### FR-001 — Home Page

The system shall provide a professional homepage containing:

- Gym name and branding
- Hero section
- Call-to-action buttons
- Short gym introduction
- Membership plan preview
- Facilities preview
- Trainer preview
- Testimonials
- Gallery preview
- Gym statistics
- Opening hours
- Location
- Contact information
- FAQ preview
- Footer

### FR-002 — About Page

The system shall display:

- Gym story
- Mission
- Vision
- Why choose the gym
- Gym rules
- Safety information

### FR-003 — Membership Page

Visitors shall be able to:

- View all active membership plans
- Compare plan features
- View price
- View duration
- View included services
- Select a plan
- Start registration/purchase

Prices must be retrieved dynamically from the backend.

### FR-004 — Facilities Page

The system shall display available gym facilities, such as:

- Strength training area
- Cardio area
- Free weights
- Locker facilities
- Shower/changing facilities
- Air conditioning
- Parking
- Other available services

### FR-005 — Trainers Page

The system shall display:

- Trainer name
- Profile image
- Specialization
- Experience
- Certifications
- Short biography

### FR-006 — Gallery

Visitors shall be able to view gym images organized by category.

### FR-007 — Contact Page

The system shall display:

- Gym address
- Phone number
- Email
- Opening hours
- Google Maps location
- Social media links
- Contact form

### FR-008 — FAQ

The system shall provide frequently asked questions regarding:

- Membership
- Pricing
- Payment
- Gym timing
- Trial sessions
- Cancellation
- Facilities
- Rules

---

# 4. Authentication & Authorization

## FR-009 — User Registration

A visitor shall be able to create an account using:

- Full name
- Email
- Phone number
- Password
- Password confirmation

The system shall validate all registration fields.

## FR-010 — User Login

Registered users shall be able to log in using:

- Email
- Password

## FR-011 — Authentication

The system shall securely authenticate users and protect private routes.

## FR-012 — Role-Based Access

The MVP shall support at least two roles:

- `USER`
- `ADMIN`

Users shall not be able to access admin functionality.

## FR-013 — Password Management

Users shall be able to change their password.

Password reset functionality may be included if time permits.

---

# 5. User Dashboard

## FR-014 — Dashboard Overview

A logged-in member shall see:

- Current membership
- Membership status
- Plan name
- Start date
- Expiry date
- Remaining membership period
- Latest payment
- Account information

## FR-015 — User Profile

Users shall be able to view and update:

- Full name
- Phone
- Email
- Profile image
- Address

Email changes should require appropriate verification if implemented.

## FR-016 — Membership Details

Users shall be able to view:

- Current plan
- Price
- Duration
- Start date
- Expiry date
- Membership status

Possible statuses:

- `PENDING`
- `ACTIVE`
- `EXPIRED`
- `CANCELLED`

## FR-017 — Payment History

Members shall be able to view:

- Transaction ID
- Amount
- Payment date
- Payment method
- Payment status
- Membership plan

---

# 6. Membership System

## FR-018 — Membership Plan

Each membership plan shall contain:

- Plan name
- Description
- Price
- Duration
- Features
- Active/inactive status
- Created date
- Updated date

Example plans:

- Monthly
- 3 Months
- 6 Months
- Annual

## FR-019 — Plan Selection

A user shall select an available membership plan before checkout.

## FR-020 — Membership Purchase

The system shall create a pending membership/order before redirecting the user to the payment gateway.

## FR-021 — Membership Activation

A membership shall become `ACTIVE` only after successful payment verification.

The frontend shall not be allowed to activate a membership by itself.

---

# 7. Payment System

## FR-022 — SSLCOMMERZ Integration

The MVP shall integrate **SSLCOMMERZ** for online payments.

Supported payment methods will depend on the SSLCOMMERZ account/configuration.

## FR-023 — Checkout

The checkout process shall display:

- Customer information
- Selected membership plan
- Membership duration
- Price
- Total amount
- Payment method/gateway

## FR-024 — Payment Verification

The backend shall verify the payment result using the gateway's server-side mechanisms.

The system shall not trust only a client-side success response.

## FR-025 — Payment Status

Payments shall support statuses such as:

- `PENDING`
- `SUCCESS`
- `FAILED`
- `CANCELLED`
- `REFUNDED`

## FR-026 — Transaction Record

Every payment attempt shall store:

- Internal payment ID
- User ID
- Membership/order ID
- Transaction ID
- Amount
- Currency
- Gateway status
- Payment method
- Created date
- Updated date

## FR-027 — Payment Result

After payment, the user shall be redirected to an appropriate result page:

- Payment successful
- Payment failed
- Payment cancelled

---

# 8. Admin Panel

## FR-028 — Admin Dashboard

The admin dashboard shall display:

- Total users
- Active members
- Expired members
- Pending memberships
- Total successful payments
- Revenue summary
- Recent registrations
- Recent payments

## FR-029 — Member Management

Admins shall be able to:

- View members
- Search members
- Filter members
- View member details
- View membership
- View payment history
- Activate/deactivate user accounts
- Delete users when appropriate

## FR-030 — Membership Plan Management

Admins shall be able to:

- Create plans
- View plans
- Update plans
- Activate/deactivate plans
- Delete plans when safe

Admin changes to prices shall automatically affect future purchases.

Existing completed payments shall retain their original transaction amount.

## FR-031 — Payment Management

Admins shall be able to:

- View payments
- Search by transaction ID
- Filter by payment status
- View payment details
- View member information
- View payment date and amount

## FR-032 — Trainer Management

Admins shall be able to:

- Add trainer
- Edit trainer
- Delete trainer
- Activate/deactivate trainer
- Upload trainer image
- Manage specialization and biography

## FR-033 — Gallery Management

Admins shall be able to:

- Upload images
- Add image title/category
- Delete images
- Enable/disable gallery items

## FR-034 — Content Management

The admin shall be able to manage basic website content such as:

- Gym information
- Contact information
- Opening hours
- Facilities
- FAQs

For the MVP, this can be implemented using database-managed content rather than a complex CMS.

---

# 9. Notification Requirements

## FR-035 — In-App Notifications

The system may provide basic notifications for:

- Successful payment
- Membership activation
- Membership expiry reminder

## FR-036 — Email Notifications

If email service is configured, the system should send:

- Registration confirmation
- Payment confirmation
- Membership activation
- Membership expiry reminder

Email notifications are secondary to the core membership/payment functionality.

---

# 10. Database Requirements

The database should contain, at minimum, the following entities.

## User

Fields:

- id
- name
- email
- phone
- passwordHash
- role
- status
- profileImage
- address
- createdAt
- updatedAt

## MembershipPlan

Fields:

- id
- name
- description
- price
- durationDays
- features
- isActive
- createdAt
- updatedAt

## Membership

Fields:

- id
- userId
- planId
- startDate
- endDate
- status
- priceAtPurchase
- createdAt
- updatedAt

## Payment

Fields:

- id
- userId
- membershipId
- transactionId
- amount
- currency
- paymentMethod
- status
- gatewayResponse/reference
- createdAt
- updatedAt

## Trainer

Fields:

- id
- name
- image
- specialization
- experience
- certifications
- bio
- isActive
- createdAt
- updatedAt

## GalleryImage

Fields:

- id
- title
- imageUrl
- category
- isActive
- createdAt
- updatedAt

## Facility

Fields:

- id
- name
- description
- image
- isActive
- createdAt
- updatedAt

## FAQ

Fields:

- id
- question
- answer
- isActive
- createdAt
- updatedAt

## Notification

Fields:

- id
- userId
- title
- message
- type
- isRead
- createdAt

---

# 11. Non-Functional Requirements

## NFR-001 — Performance

- Public pages should load quickly.
- API responses should generally be below 500ms under normal load, excluding third-party services.
- Images should be optimized.
- Database queries should use appropriate indexes.

## NFR-002 — Responsiveness

The website shall work on:

- Mobile phones
- Tablets
- Laptops
- Desktop computers

## NFR-003 — Security

The application shall:

- Hash passwords securely
- Validate user input
- Protect private API routes
- Implement role-based authorization
- Use HTTPS in production
- Store secrets in environment variables
- Implement rate limiting where appropriate
- Configure CORS securely
- Avoid exposing sensitive payment information
- Verify payment callbacks/server responses
- Prevent duplicate payment processing
- Sanitize/validate file uploads

## NFR-004 — Reliability

Payment and membership operations should be designed so that a temporary failure does not create an incorrectly activated membership.

## NFR-005 — Maintainability

The codebase should:

- Use a modular architecture
- Follow consistent naming conventions
- Separate business logic from controllers/routes
- Use reusable components
- Use environment-based configuration
- Include centralized error handling

## NFR-006 — Scalability

The architecture should allow future addition of:

- Multiple gym branches
- Attendance
- Class booking
- Trainer booking
- Mobile applications
- Advanced analytics

---

# 12. Recommended Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- React Hook Form
- Zod

## Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM

## Database

- PostgreSQL

## Authentication

- Secure HTTP-only cookies or JWT-based authentication
- Password hashing using Argon2 or bcrypt

## Payment

- SSLCOMMERZ

## Image Storage

- Cloudinary or S3-compatible object storage

## Email

- SMTP / Resend / another transactional email provider

## Deployment

Suggested architecture:

```text
User
  |
  v
React Frontend
  |
  v
Node.js + Express API
  |
  +------> PostgreSQL
  |
  +------> SSLCOMMERZ
  |
  +------> Image Storage
  |
  +------> Email Service
```

---

# 13. Main User Flow

## 13.1 Visitor → Member

```text
Visit Website
      |
      v
View Gym Information
      |
      v
View Membership Plans
      |
      v
Select Plan
      |
      v
Register / Login
      |
      v
Checkout
      |
      v
SSLCOMMERZ
      |
      v
Payment Verification
      |
      v
Membership Activated
      |
      v
Member Dashboard
```

## 13.2 Admin Flow

```text
Admin Login
    |
    v
Admin Dashboard
    |
    +--> Manage Members
    |
    +--> Manage Membership Plans
    |
    +--> Manage Payments
    |
    +--> Manage Trainers
    |
    +--> Manage Gallery
    |
    +--> Manage Facilities
    |
    +--> Manage FAQs
```

---

# 14. API Requirements

The backend should expose RESTful APIs.

## Authentication

```text
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
PATCH  /api/auth/password
```

## Users

```text
GET    /api/users/me
PATCH  /api/users/me
```

## Membership Plans

```text
GET    /api/membership-plans
GET    /api/membership-plans/:id
POST   /api/membership-plans       # Admin
PATCH  /api/membership-plans/:id   # Admin
DELETE /api/membership-plans/:id   # Admin
```

## Memberships

```text
GET    /api/memberships/me
GET    /api/memberships/:id
POST   /api/memberships
```

## Payments

```text
POST   /api/payments/create
POST   /api/payments/success
POST   /api/payments/fail
POST   /api/payments/cancel
POST   /api/payments/ipn
GET    /api/payments/me
GET    /api/admin/payments
```

> Exact SSLCOMMERZ callback/validation routes should follow the current SSLCOMMERZ integration requirements.

## Admin

```text
GET    /api/admin/dashboard
GET    /api/admin/users
PATCH  /api/admin/users/:id/status
GET    /api/admin/memberships
GET    /api/admin/payments
```

## Trainers

```text
GET    /api/trainers
GET    /api/trainers/:id
POST   /api/trainers
PATCH  /api/trainers/:id
DELETE /api/trainers/:id
```

## Gallery

```text
GET    /api/gallery
POST   /api/gallery
DELETE /api/gallery/:id
```

---

# 15. UI Pages

## Public

```text
/
├── Home
├── About
├── Membership
├── Facilities
├── Trainers
├── Gallery
├── FAQ
└── Contact
```

## Authentication

```text
/login
/register
/forgot-password
/reset-password
```

## Member

```text
/dashboard
/dashboard/profile
/dashboard/membership
/dashboard/payments
/dashboard/notifications
```

## Payment

```text
/checkout
/payment/success
/payment/fail
/payment/cancel
```

## Admin

```text
/admin
/admin/users
/admin/memberships
/admin/plans
/admin/payments
/admin/trainers
/admin/gallery
/admin/facilities
/admin/faqs
/admin/settings
```

---

# 16. Business Rules

### BR-001
Only active membership plans can be purchased.

### BR-002
A membership becomes active only after successful server-side payment verification.

### BR-003
The amount stored in a completed payment must represent the actual amount paid, even if the plan price changes later.

### BR-004
An expired membership cannot be used as an active membership.

### BR-005
An admin can deactivate a membership plan without deleting historical membership/payment records.

### BR-006
A user cannot access another user's private membership or payment information.

### BR-007
Only authorized administrators can access admin APIs.

### BR-008
Payment callbacks must be idempotent so the same successful payment cannot create duplicate memberships.

### BR-009
Deleting a plan, user, or other entity must not unintentionally delete required financial transaction records.

---

# 17. MVP Acceptance Criteria

The MVP will be considered complete when:

- [ ] Visitor can open and navigate the complete public website.
- [ ] Visitor can view gym information.
- [ ] Visitor can view membership plans.
- [ ] User can register.
- [ ] User can log in.
- [ ] User can select a membership plan.
- [ ] User can complete checkout.
- [ ] User can pay through SSLCOMMERZ.
- [ ] Backend verifies payment correctly.
- [ ] Successful payment activates the membership.
- [ ] User can see membership information in dashboard.
- [ ] User can see payment history.
- [ ] Admin can log in.
- [ ] Admin can view dashboard statistics.
- [ ] Admin can manage users.
- [ ] Admin can manage membership plans.
- [ ] Admin can view/manage payments.
- [ ] Admin can manage trainers.
- [ ] Admin can manage gallery content.
- [ ] Website is responsive.
- [ ] Authentication and authorization are implemented.
- [ ] Core APIs have validation and error handling.
- [ ] Production environment uses HTTPS and environment variables.

---

# 18. Future Roadmap

After completing the MVP:

### Version 1.1
- QR attendance
- Membership expiry reminders
- Better analytics
- Coupon system

### Version 1.2
- Class scheduling
- Class booking
- Personal trainer booking
- Trainer dashboard

### Version 2.0
- Multi-branch support
- Advanced reporting
- Mobile application
- Automated marketing
- Subscription/renewal system

---

# 19. Success Metrics

The MVP should make it possible to measure:

- Number of registered users
- Number of active members
- Number of membership purchases
- Successful payment rate
- Monthly revenue
- Most popular membership plan
- Number of contact inquiries
- Membership conversion rate

---

# 20. Project Principle

The MVP should prioritize:

**Reliable membership purchase + secure payment + simple administration + excellent user experience.**

Avoid adding complex features before the core flow is stable.

The most important production flow is:

```text
Discover Gym
     ↓
Choose Membership
     ↓
Create Account
     ↓
Checkout
     ↓
SSLCOMMERZ Payment
     ↓
Server-side Verification
     ↓
Activate Membership
     ↓
Member Dashboard
```

This flow must be secure, reliable, and fully tested before expanding the platform.
