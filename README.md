# 🎅 SantaOS - The Operating System for Christmas

A modern, beautiful web application built with React, TypeScript, and Tailwind CSS to help Santa manage Christmas operations efficiently.

## ✨ Features

### 🎅 Admin (Santa) Features
- **Dashboard Overview**: Real-time statistics, metrics, and visual analytics
- **Analytics Charts**: Interactive visualizations for:
  - Top Requested Toys (Bar Chart)
  - Nice vs Naughty Ratio (Doughnut Chart)
  - Auto-refreshes every 30 seconds
- **Children & Wishlists Management**: 
  - View all submitted wishlists in real-time
  - Filter by Nice/Naughty status
  - Search by name or location
  - View detailed wishlist items with priorities
  - **Toggle Nice/Naughty status** with one click (😇/😈)
  - Real-time chart updates when status changes
- **Task Assignment**: Assign gift production tasks to elves
- **Delivery Tracking**: Monitor deliveries across all regions worldwide

### 🧝 Worker (Elf) Features
- **Personal Dashboard**: 
  - Real-time task statistics
  - Track your performance and productivity
  - View assigned, pending, in-progress, and completed tasks
  - Auto-refreshes every 30 seconds
- **Task Management**: 
  - View all assigned tasks with details
  - **Start tasks** (pending → in-progress)
  - **Mark tasks as complete** (in-progress → completed)
  - Filter tasks by status
  - Update progress with notes
- **Achievements**: Earn badges for outstanding performance

### 👶 Public Features
- **Wishlist Submission**: Children can submit their Christmas wishlists
  - Enter name, age, and location
  - Add multiple gift items with priorities (High/Medium/Low)
  - Receive tracking code upon submission
  - Beautiful, festive UI with smooth animations

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Visualization**: Chart.js + react-chartjs-2
- **Routing**: React Router v6
- **Build Tool**: Vite
- **Icons**: Emoji-based (no external dependencies)

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

**Note**: Make sure the backend server is running on `http://localhost:3000` for full functionality.

## 🎨 Design Features

- **Modern Dark Theme**: Eye-catching dark mode with Christmas colors
- **Glassmorphism**: Beautiful glass-effect cards and components
- **Smooth Animations**: Micro-interactions and transitions
- **Responsive Design**: Works perfectly on all devices
- **Accessibility**: Semantic HTML and proper ARIA labels
- **Loading States**: Elegant loading spinners and error handling
- **Real-time Updates**: Dashboard auto-refreshes to show latest data

## 🎯 Pages

### Authentication
- `/` - Login page with role selection (Santa/Elf)
  - Secure authentication with backend validation
  - Role-based access control
  - Persistent sessions using Zustand

### Admin Routes (Protected)
- `/admin/dashboard` - Admin dashboard with statistics and charts
- `/admin/children` - Children and wishlists management (real-time data)
- `/admin/tasks` - Task assignment and management
- `/admin/deliveries` - Delivery tracking

### Worker Routes (Protected)
- `/worker/dashboard` - Worker dashboard with personal stats
- `/worker/tasks` - Task management and progress updates

### User Routes (Public)
- `/user/wishlist` - Public wishlist submission form for children
- `/user/track` - Track gift delivery status

## 🎨 Color Palette

- **Santa Red**: `#C41E3A`
- **Christmas Green**: `#165B33`
- **Gold Accent**: `#FFD700`
- **Dark Background**: `#0A0E27`
- **Card Background**: `#1A2238`

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx      # Real-time analytics dashboard
│   │   │   ├── ChildrenWishlists.tsx   # Wishlist management
│   │   │   ├── TaskAssignment.tsx
│   │   │   └── DeliveryTracking.tsx
│   │   ├── worker/
│   │   │   ├── WorkerDashboard.tsx
│   │   │   └── WorkerTasks.tsx
│   │   ├── user/
│   │   │   ├── Wishlist.tsx            # Public wishlist form
│   │   │   └── TrackGift.tsx
│   │   └── Login.tsx                   # Authentication page
│   ├── layouts/
│   │   └── Layout.tsx                  # Main layout with navigation
│   ├── components/
│   │   └── ProtectedRoute.tsx          # Route protection HOC
│   ├── store/
│   │   └── authStore.ts                # Zustand auth state
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## 🔧 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📝 Demo Credentials

### Admin (Santa)
- Email: `santa@northpole.com`
- Password: `hohoho`
- Role: Admin

### Worker (Elf)
- Email: `elf@workshop.com`
- Password: `hohoho`
- Role: Worker

**Note**: These credentials are seeded in the database. Make sure to run `npx prisma db seed` in the backend first.

## 📸 Screenshots

*(Please add screenshots of the application here to showcase the UI)*

## 🎄 Future Enhancements

- [x] Backend API integration with Node.js
- [x] Advanced analytics and reporting with Chart.js
- [x] Authentication and authorization with Zustand
- [x] Route protection and role-based access
- [x] Public wishlist submission form
- [x] Real-time data updates
- [ ] WebSocket integration for instant updates
- [ ] Email notifications for wishlist confirmations
- [ ] Mobile app version (React Native)
- [ ] Multi-language support (i18n)
- [ ] Gift tracking with real-time status
- [ ] Admin approval workflow for wishlists
- [ ] Task automation and assignment logic

## 👨‍💻 Author

Built for the hackathon competition with ❤️ and Christmas spirit!

## 📄 License

MIT License - Feel free to use this project for your hackathon or learning purposes!

---

**Made with 🎅 by the SantaOS Team**
