import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './layouts/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// User Pages
import Home from './pages/user/Home';
import Wishlist from './pages/user/Wishlist';
import TrackGift from './pages/user/TrackGift';
import About from './pages/user/About';
import Contact from './pages/user/Contact';
import FAQ from './pages/user/FAQ';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ChildrenWishlists from './pages/admin/ChildrenWishlists';
import TaskAssignment from './pages/admin/TaskAssignment';
import DeliveryTracking from './pages/admin/DeliveryTracking';

// Worker Pages
import WorkerDashboard from './pages/worker/WorkerDashboard';
import WorkerTasks from './pages/worker/WorkerTasks';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public User Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/user/wishlist" element={<Wishlist />} />
        <Route path="/user/track" element={<TrackGift />} />
        <Route path="/user/about" element={<About />} />
        <Route path="/user/contact" element={<Contact />} />
        <Route path="/user/faq" element={<FAQ />} />

        {/* Staff Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Admin Routes - Protected */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/*" element={
            <Layout role="admin">
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="children" element={<ChildrenWishlists />} />
                <Route path="tasks" element={<TaskAssignment />} />
                <Route path="deliveries" element={<DeliveryTracking />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
              </Routes>
            </Layout>
          } />
        </Route>

        {/* Worker Routes - Protected */}
        <Route element={<ProtectedRoute allowedRoles={['worker']} />}>
          <Route path="/worker/*" element={
            <Layout role="worker">
              <Routes>
                <Route path="dashboard" element={<WorkerDashboard />} />
                <Route path="tasks" element={<WorkerTasks />} />
                <Route path="*" element={<Navigate to="/worker/dashboard" replace />} />
              </Routes>
            </Layout>
          } />
        </Route>

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
