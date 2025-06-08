# Notion Clone - Admin & Worker Management System

A modern, responsive Notion clone built with Next.js 14, TypeScript, and Tailwind CSS. This project replicates Notion's clean and intuitive interface while adding comprehensive admin and worker management systems.

## 🚀 Live Demo

**Admin Panel**: `/admin/login`
- **Username**: `123`
- **Password**: `123`

**Worker Panel**: `/worker/login`
- **Username**: `worker`  
- **Password**: `worker123`

## ✨ Features

### 🎨 Core Features
- Modern, responsive UI with Tailwind CSS
- Dark/Light theme support throughout all interfaces
- Built with Next.js 14 App Router and TypeScript
- Server-side rendering for optimal performance
- Mobile-first responsive design
- JWT-based authentication system
- Role-based access control (Admin/Worker/User)

### 👑 Admin Dashboard
Complete administrative control panel accessible at `/admin/dashboard`:

#### **Dashboard Overview**
- Statistics cards showing system metrics
- Quick action buttons for common tasks
- Modern, intuitive navigation

#### **Subscribers Management** (`/admin/subscribers`)
- View and manage 150+ mock subscriber records
- Advanced search and filtering by email, status, and source
- Bulk operations (activate, deactivate, delete)
- CSV export functionality (all or filtered data)
- Newsletter sending to active subscribers
- Status management (active/inactive)

#### **Active Users Monitoring** (`/admin/active-users`)
- Real-time monitoring of 45+ active users
- Session tracking with duration and status
- Location and IP address information
- Browser and device details
- Auto-refresh every 30 seconds
- Status breakdown statistics (online/away/idle)

#### **Login History** (`/admin/logins`)
- Comprehensive log of 1,230+ login attempts
- Success/failed/blocked status tracking
- IP address and location monitoring
- Device and browser information
- Advanced filtering and search capabilities
- Security monitoring and analytics

#### **Credentials Management** (`/admin/credentials`)
- Manage 89+ user credential records
- Role assignment (admin/moderator/user)
- Provider tracking (local/google/github/microsoft)
- Permission management system
- User status control (active/inactive/suspended)
- Complete CRUD operations

#### **Quick Actions**
- **Export Subscribers**: Download CSV with all subscriber data
- **Send Newsletter**: Broadcast to all active subscribers
- **Generate Report**: Create comprehensive system reports

### 👷 Worker Dashboard
Specialized worker panel for quote request management accessible at `/worker/dashboard`:

#### **Quote Request Management**
- View and process 25+ mock quote requests
- Approve or reject pending requests
- Filter by status (pending/approved/rejected)
- Customer information display (name, email, company)
- Message preview with truncation
- Status tracking and statistics
- Responsive table design

#### **Statistics Overview**
- Total requests counter
- Pending requests requiring action
- Approved and rejected counts
- Visual status indicators

### 🔐 Authentication System
- **JWT-based authentication** with secure httpOnly cookies
- **Role-based access control** (Admin/Worker/User)
- **Middleware protection** for all secured routes
- **Automatic redirects** based on user roles
- **Session management** with secure token handling

### 📊 Data Management
- **Mock data generation** for demonstration
- **Real-time updates** and state management
- **Export functionality** with CSV downloads
- **Bulk operations** for efficient management
- **Advanced filtering** and search capabilities

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: JWT (jsonwebtoken)
- **Icons**: Lucide React
- **Theme**: next-themes
- **Database**: MongoDB support (with Mongoose)
- **Deployment**: Vercel ready

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB (optional - currently using mock data)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Turbo9k/notion.git
   cd notion
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file:
   ```env
   JWT_SECRET=your-super-secret-jwt-key-here
   MONGODB_URI=your_mongodb_connection_string (optional)
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**:
   Navigate to `http://localhost:3000`

## 🔑 Login Credentials

### Admin Access
- **URL**: `/admin/login`
- **Username**: `123`
- **Password**: `123`
- **Access**: Full administrative control

### Worker Access  
- **URL**: `/worker/login`
- **Username**: `worker`
- **Password**: `worker123`
- **Access**: Quote request management

## 📁 Project Structure

```
├── app/                     # Next.js 14 app directory
│   ├── admin/              # Admin panel pages
│   │   ├── dashboard/      # Main admin dashboard
│   │   ├── subscribers/    # Subscriber management
│   │   ├── active-users/   # User monitoring
│   │   ├── logins/         # Login history
│   │   ├── credentials/    # User credentials
│   │   └── login/          # Admin login
│   ├── worker/             # Worker panel pages
│   │   ├── dashboard/      # Worker dashboard
│   │   └── login/          # Worker login
│   ├── api/                # API routes
│   │   ├── admin/          # Admin APIs
│   │   ├── auth/           # Authentication
│   │   └── worker/         # Worker APIs
│   └── (routes)/           # Public pages
├── components/             # React components
├── lib/                    # Utility functions
├── middleware.ts           # Route protection
├── types/                  # TypeScript definitions
└── public/                 # Static assets
```

## 🎯 Key Features Implementation

### Authentication Flow
- JWT tokens stored in secure httpOnly cookies
- Middleware-based route protection
- Role-based access control
- Automatic redirects based on authentication state

### Admin Features
- **Comprehensive Dashboard**: Statistics overview with navigation cards
- **Advanced Data Management**: CRUD operations with bulk actions
- **Export Functionality**: CSV downloads with filtered data
- **Real-time Monitoring**: Live user tracking and session management
- **Security Tracking**: Login attempts and access monitoring

### Worker Features
- **Quote Management**: Process customer quote requests
- **Status Tracking**: Approve/reject workflow
- **Customer Information**: Complete request details
- **Statistics Dashboard**: Performance metrics and counters

### UI/UX Features
- **Responsive Design**: Works on all devices
- **Dark/Light Themes**: User preference support
- **Modern Interface**: Clean, intuitive design
- **Loading States**: Smooth user experience
- **Error Handling**: Graceful error management

## 🔧 Customization

### Adding New Admin Features
1. Create new page in `/app/admin/[feature]/page.tsx`
2. Add navigation link in admin dashboard
3. Implement API routes if needed
4. Add middleware protection

### Extending Worker Capabilities
1. Add new functionality to worker dashboard
2. Create corresponding API endpoints
3. Update worker navigation

### Database Integration
- Replace mock data with real database queries
- Update API routes to use MongoDB
- Implement proper error handling

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Add environment variables
4. Deploy automatically

### Manual Deployment
1. Build the project: `npm run build`
2. Start production server: `npm start`
3. Configure environment variables
4. Set up reverse proxy if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspired by Notion
- Icons from Lucide React
- Built with Next.js and TypeScript
- Styled with Tailwind CSS

## 📞 Support

For support, please open an issue on GitHub or contact the maintainers.

---

**Made with ❤️ for the developer community** 