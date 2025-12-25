# BDMS - Blood Donation Management System

A comprehensive web-based Blood Donation Management System built as a 6th semester project. This platform connects donors, hospitals, blood banks, and administrators to streamline blood donation and distribution processes.

## 🩸 Overview

BDMS is a full-stack application designed to manage the entire blood donation ecosystem. It provides dedicated portals for different user roles, ensuring efficient blood inventory management, donation tracking, and request handling.

## ✨ Features

### Multi-Portal System
- **Donor Portal** - Register, view donation history, find blood camps, download certificates
- **Hospital Portal** - Request blood units, track requests, manage patient needs
- **Blood Bank Portal** - Manage inventory, process requests, coordinate with hospitals
- **Admin Portal** - Oversee all operations, manage facilities, verify users, organize camps

### Core Functionality
- 🔐 Secure JWT-based authentication
- 📊 Real-time blood inventory tracking
- 🏥 Hospital & Blood Bank verification system
- 🎪 Blood donation camp management
- 📜 Digital donation certificates for donors
- 🔔 Notification system
- 📱 Responsive design for all devices

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | Next.js 16, React 19, TailwindCSS 4 |
| **Backend** | Next.js API Routes |
| **Database** | MongoDB with Mongoose |
| **Authentication** | JWT (jose), bcryptjs |
| **Icons** | Lucide React |
| **PDF Generation** | jsPDF, html2canvas |
| **HTTP Client** | Axios |

## 📁 Project Structure

```
BDMS/
└── blood_d/
    └── src/
        └── app/
            ├── (auth)/          # Authentication pages
            ├── login/           # Login page
            ├── admin/           # Admin dashboard & pages
            │   ├── camps/       # Blood camp management
            │   ├── donations/   # Donation records
            │   ├── donors/      # Donor management
            │   ├── facilities/  # Hospital & blood bank management
            │   └── verification/# User verification
            ├── blood-bank/      # Blood bank portal
            ├── donor/           # Donor portal
            │   ├── camps/       # Find blood camps
            │   ├── certificate/ # Download donation certificate
            │   └── history/     # Donation history
            ├── hospital/        # Hospital portal
            └── api/             # Backend API routes
                ├── auth/        # Authentication endpoints
                ├── camps/       # Camp CRUD operations
                ├── donations/   # Donation management
                ├── inventory/   # Blood inventory
                ├── requests/    # Blood requests
                └── users/       # User management
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/cmd-SahilD/BDMS.git
   cd BDMS/blood_d
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the `blood_d` directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## 👥 User Roles

| Role | Description |
|------|-------------|
| **Donor** | Individuals who donate blood |
| **Hospital** | Medical facilities requesting blood |
| **Blood Bank** | Facilities that store and manage blood units |
| **Admin** | System administrators with full access |

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected API routes with middleware
- Role-based access control

## 📄 License

This project is developed for educational purposes as part of a 6th semester academic project.

---

**Made with ❤️ for saving lives through better blood management**
