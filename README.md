# 🎅 SantaOS - The Operating System for Christmas

A modern, beautiful web application built with React, TypeScript, and Tailwind CSS to help Santa manage Christmas operations efficiently.

## ✨ Features

### 🎅 Admin (Santa) Features
- **Dashboard Overview**: Real-time statistics, metrics, and visual analytics
- **Analytics Charts**: Visual insights on Gift Demand and Behavior (Nice/Naughty) using interactive charts
- **Children & Wishlists Management**: View and manage children's information and gift requests
- **Task Assignment**: Assign gift production tasks to elves
- **Delivery Tracking**: Monitor deliveries across all regions worldwide

### 🧝 Worker (Elf) Features
- **Personal Dashboard**: Track your performance and productivity
- **Task Management**: View and update assigned tasks
- **Progress Tracking**: Update task progress with notes
- **Achievements**: Earn badges for outstanding performance

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

## 🎨 Design Features

- **Modern Dark Theme**: Eye-catching dark mode with Christmas colors
- **Glassmorphism**: Beautiful glass-effect cards and components
- **Smooth Animations**: Micro-interactions and transitions
- **Responsive Design**: Works perfectly on all devices
- **Accessibility**: Semantic HTML and proper ARIA labels

## 🎯 Pages

### Authentication
- `/` - Login page with role selection (Santa/Elf)

### Admin Routes
- `/admin/dashboard` - Admin dashboard with statistics and charts
- `/admin/children` - Children and wishlists management
- `/admin/tasks` - Task assignment and management
- `/admin/deliveries` - Delivery tracking

### Worker Routes
- `/worker/dashboard` - Worker dashboard with personal stats
- `/worker/tasks` - Task management and progress updates

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
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── ChildrenWishlists.tsx
│   │   │   ├── TaskAssignment.tsx
│   │   │   └── DeliveryTracking.tsx
│   │   ├── worker/
│   │   │   ├── WorkerDashboard.tsx
│   │   │   └── WorkerTasks.tsx
│   │   └── Login.tsx
│   ├── layouts/
│   │   └── Layout.tsx
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
- Email: santa@northpole.com
- Password: (any password)

### Worker (Elf)
- Email: elf@workshop.com
- Password: (any password)

## 📸 Screenshots

*(Please add screenshots of the application here to showcase the UI)*

## 🎄 Future Enhancements

- [x] Backend API integration with Node.js
- [x] Advanced analytics and reporting
- [ ] Real-time updates with WebSockets
- [ ] Email notifications
- [ ] Mobile app version
- [ ] Multi-language support

## 👨‍💻 Author

Built for the hackathon competition with ❤️ and Christmas spirit!

## 📄 License

MIT License - Feel free to use this project for your hackathon or learning purposes!

---

**Made with 🎅 by the SantaOS Team**
