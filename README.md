# User Management Dashboard

## 📋 Project Overview

This is a comprehensive React-based User Management Dashboard that provides a full authentication system and data management capabilities. The application features secure user registration, login, and a dynamic data table with CRUD (Create, Read, Update, Delete) operations.

## ✨ Features

### Authentication
- User Registration
- User Login
- User Logout
- Account Deletion
- Local Storage Persistence

### Dashboard
- Responsive Design
- User Profile Display
- Sidebar Navigation
- Data Management Table
  - Add new records
  - Edit existing records
  - Delete records
  - Search functionality
  - Sorting capabilities
  - Pagination

## 🚀 Technologies Used

- React
- React Hooks (useState, useEffect, useContext)
- Local Storage for State Management
- CSS for Responsive Design

## 🔧 Installation

### Prerequisites
- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

### Steps
1. Clone the repository
```bash
git clone https://github.com/yourusername/user-management-dashboard.git
```

2. Navigate to project directory
```bash
cd user-management-dashboard
```

3. Install dependencies
```bash
npm install
```

4. Start the development server
```bash
npm start
```

## 🌟 Key Components

### Authentication Flow
- **SignupForm**: Allows new users to create an account
  - Validates email uniqueness
  - Requires password confirmation
  - Stores user data in local storage

- **LoginForm**: Enables existing users to log in
  - Validates credentials
  - Provides error handling
  - Manages user session

### DataTable
- Supports full CRUD operations
- Implements client-side searching
- Provides sorting capabilities
- Includes pagination

## 🔒 Security Features
- Password hashing (basic base64 encoding)
- Local storage for session management
- Email uniqueness check during registration

## 📱 Responsive Design
- Mobile-friendly layout
- Adaptive components
- Touch-friendly interfaces
- Breakpoints at 768px and 480px

## 🔍 Known Limitations
- Uses local storage (not suitable for production)
- Basic password hashing (requires more robust solution)
- Client-side only authentication

## 🚧 Potential Improvements
- Implement backend authentication
- Add more robust password hashing
- Create admin management features
- Integrate with database
- Add more comprehensive form validation

## 📄 License
MIT License

## 👥 Contributors
- [Priyanshu Raj]

## 🙌 How to Contribute
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 💡 Support
For support, please open an issue in the GitHub repository or contact [rajp58425@gmail.com].
