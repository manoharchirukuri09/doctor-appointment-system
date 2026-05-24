<div align="center">

# 🩺 DocBook — Doctor Appointment Booking System  

### 🚀 Production-Grade Full-Stack Java Application  

A **production-grade full-stack doctor appointment booking platform** built using modern web technologies.  
DocBook delivers a seamless, secure, and intuitive experience for patients to search doctors, book appointments, and pay consultation fees online, while providing dedicated dashboards for doctors and administrators.

This project simulates a real-world system and demonstrates strong expertise in:
- Full-stack development (React + Spring Boot)
- Secure authentication using JWT and role-based access control (RBAC)
- Scalable backend architecture and REST API design
- Third-party integrations (Cloudinary, Razorpay, Gmail SMTP)
- Data visualization (Recharts) and interactive UI design

It includes distinct, tailored workflows for **Patients** (appointment booking, payment), **Doctors** (schedule management, analytics), and **Admins** (doctor onboarding, system stats), making it a complete end-to-end application.

---

## 🚀 Tech Stack Highlights

![Java](https://img.shields.io/badge/Java-21+-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.1-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.4.8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

</div>

---

Live Demo : https://doctor-appointment-system-xi-three.vercel.app/

## 🚀 Tech Stack

### Frontend
- React 18 (Vite)
- React Router DOM 6
- Axios (with interceptors for JWT attachment and token expiration)
- Recharts (for dashboard analytics visualizations)
- Lucide React & React Icons (for icons)
- react-datepicker & SlotPicker (for appointment scheduling)
- react-hot-toast & react-toastify (for interactive notifications)

### Backend
- Spring Boot 3.4
- Spring Security + JWT (Stateless authentication)
- Spring Data JPA (Hibernate ORM)
- Lombok & ModelMapper
- Spring Boot Starter Validation & Actuator

### Database & Storage
- MySQL 8+
- Cloudinary API (for profile image hosting)

### Payment Gateway
- Razorpay Payment Gateway Integration

---

## ✨ Key Features

### 👤 Patient Features
- 🔍 **Browse & Filter Doctors:** View available doctors and filter them by medical speciality.
- 🛏️ **Real-time Slot Booking:** Select available dates and times for doctor appointments.
- 💳 **Online Consultation Fee Payment:** Pay securely via Razorpay once the doctor confirms the appointment.
- 🔒 **Profile Management:** Update personal details and upload a profile picture using Cloudinary.
- 📜 **Appointment History:** Track pending, confirmed, completed, and cancelled appointments.

---

### 🥼 Doctor Features
- 📈 **Doctor Dashboard Analytics:** Real-time metrics for total appointments, total patients, and total earnings.
- 📅 **Appointment Management:** Review booking requests to accept, cancel, or mark them as completed.
- ⚙️ **Profile Customization:** Modify biography, specialization, experience, consultation fees, and availability.
- 🖼️ **Image Uploads:** Upload high-quality professional avatars directly to Cloudinary.

---

### 🛡️ Admin Features
- 🏥 **Doctor Onboarding:** Create user accounts and onboard new doctors into the system.
- 👥 **User Directory:** View all registered patients and doctors.
- 📊 **Comprehensive Analytics:** Aggregated statistics on overall bookings, total earnings, and platform usage.
- ⚙️ **Doctor Control:** Toggle active/inactive status for doctor profiles to manage scheduling options.

---

### 🔒 Security & Performance
- JWT stateless authentication with custom JWT filter
- Role-Based Access Control (RBAC) supporting `PATIENT`, `DOCTOR`, and `ADMIN`
- BCrypt password hashing for secure user storage
- Global exception handling (`GlobalExceptionHandler` returning standardized API responses)
- DTO validation via JSR 380 annotations
- CORS configurations enabling secure frontend-backend communication

---

## 🏗️ Architecture Overview

```
Controller → Service → Repository → Database
↓
DTO Layer (Validation & Mapping via ModelMapper)
```

---

## ⚡ Quick Start

### Prerequisites
- Java 21+
- Maven 3.9+
- Node.js 18+
- MySQL 8+

---

### 1️⃣ Database Setup
Create a new schema in your MySQL instance:
```sql
CREATE DATABASE doctor_appointment_db;
```

---

### 2️⃣ Backend Configuration
Create or edit the `src/main/resources/application.properties` file:

```properties
server.port=8080
server.servlet.context-path=/api

# Database connection
spring.datasource.url=jdbc:mysql://localhost:3306/doctor_appointment_db?createDatabaseIfNotExist=true
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD

# Security & JWT Configuration
app.jwt.secret=YOUR_BASE64_256BIT_SECRET_KEY
app.jwt.expiration=86400000

# Cloudinary Integration
cloudinary.cloud_name=YOUR_CLOUDINARY_CLOUD_NAME
cloudinary.api_key=YOUR_CLOUDINARY_API_KEY
cloudinary.api_secret=YOUR_CLOUDINARY_API_SECRET

# Razorpay Payment Settings
razorpay.key-id=YOUR_RAZORPAY_KEY_ID
razorpay.key-secret=YOUR_RAZORPAY_KEY_SECRET

# Email / Mail configuration (Gmail SMTP example)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=YOUR_GMAIL_ADDRESS
spring.mail.password=YOUR_GMAIL_APP_PASSWORD
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true

# App Custom Properties
app.frontend-url=http://localhost:5173
```

---

### 3️⃣ Run Backend

From the current folder, run:
```bash
mvn spring-boot:run
```
The backend API is now running on: 👉 [http://localhost:8080/api](http://localhost:8080/api)

---

### 4️⃣ Run Frontend

From the current folder, navigate to the Frontend directory, configure environment variables in `.env`, and run:
```bash
cd Frontend
npm install
npm run dev
```
The frontend application is now running on: 👉 [http://localhost:5173](http://localhost:5173)

---

## 🔗 API Highlights

### Authentication
* `POST /api/auth/register` — Register a new patient
* `POST /api/auth/login` — Sign in and obtain a JWT token

### Doctor Operations
* `GET /api/doctors` — Public list of active doctors (filterable by `speciality`)
* `GET /api/doctors/{id}` — Fetch doctor profile details by ID
* `GET /api/doctors/dashboard` — Fetch dashboard metrics for authenticated doctor
* `PUT /api/doctors/profile` — Update professional doctor details

### Patient & User Operations
* `GET /api/user/profile` — Get profile info
* `PUT /api/user/profile` — Update profile info and avatar URL

### Appointment Booking
* `POST /api/appointments/book` — Patient books a slot (starts as `PENDING`)
* `GET /api/appointments/patient` — List patient's booking history
* `GET /api/appointments/doctor` — List doctor's assigned bookings
* `PUT /api/appointments/{id}/cancel` — Cancel appointment (available to patient & doctor)
* `PUT /api/appointments/{id}/accept` — Doctor accepts booking (status -> `CONFIRMED`)
* `PUT /api/appointments/{id}/complete` — Doctor completes booking (status -> `COMPLETED`)

### Payment Operations
* `POST /api/payments/create-order` — Create Razorpay order ID (for CONFIRMED appointments)
* `POST /api/payments/verify` — Verify Razorpay payment signature and mark as `PAID`

---

## 💳 Payment Gateway (Razorpay Flow)

The application integrates Razorpay to handle payments for consultation fees securely:

1. Patient checks appointment status. If **CONFIRMED** by the doctor, a Pay Button appears.
2. Frontend requests `/api/payments/create-order` with the appointment ID.
3. Backend communicates with the Razorpay API to generate a unique `razorpay_order_id`.
4. Frontend launches the Razorpay Checkout Modal using the generated order ID.
5. On successful checkout, Razorpay provides verification signatures.
6. Frontend sends signatures to `/api/payments/verify`.
7. Backend verifies signature validity using HMAC-SHA256 hashing. If valid, the appointment payment status is marked as `PAID`.

---

## 🖼️ Cloudinary Integration

Profiles use Cloudinary to manage professional avatar and patient picture uploads dynamically:
- Uploads are triggered via `POST /api/upload/image`.
- Multipart files are sent to the controller.
- The service processes the files and uploads them securely to a Cloudinary folder.
- Secured URLs are returned to the frontend and persisted inside the database.

---

## 🔐 Security Highlights

- **JWT Auth Filter:** Stateless request interceptor verifying headers on every secured request.
- **Method Level Security:** `@PreAuthorize` guards endpoints, preventing unauthorized access across patient, doctor, and admin spaces.
- **Password Safety:** BCrypt encoder used to hash user passwords during registration.

---

## 🌐 Frontend Routes

### 🔓 Public Routes
* `/` → Home page with search capabilities
* `/doctors` → Directory list of doctors
* `/doctors/:id` → Individual doctor overview
* `/login` & `/register` → Authentication forms

### 👤 Patient Routes (Authenticated)
* `/patient/dashboard` → Main panel with booking overview
* `/patient/book/:doctorId` → Booking slot picker interface
* `/patient/appointments` → Listing and payment management portal
* `/patient/profile` → Personal details configuration

### 🥼 Doctor Routes (Authenticated)
* `/doctor/dashboard` → Earnings and statistics panel
* `/doctor/appointments` → Patient request queues (Accept, Cancel, Complete)
* `/doctor/profile` → Biography and slot settings

### 🛡️ Admin Routes (Authenticated)
* `/admin/dashboard` → Consolidated platform overview
* `/admin/doctors` → List of all practitioners on the site
* `/admin/doctors/add` → New doctor registration form
* `/admin/appointments` → Comprehensive log of all appointments

---

## 📌 Highlights

✔ Fully responsive full-stack platform  
✔ Clean layered architecture (Controller, Service, Repository, DTO)  
✔ Secure transaction workflows  
✔ Production-ready error handling  
✔ Dynamic interactive charts (Recharts)  

---

## 👨‍💻 Author

**Manohar Chirukuri**  
📧 [manoharchirukuri09@gmail.com](mailto:manoharchirukuri09@gmail.com)  
🔗 [https://www.linkedin.com/in/manoharchirukuri/](https://www.linkedin.com/in/manoharchirukuri/)  

---

## 📄 License

Full-Stack Java Learning Project
