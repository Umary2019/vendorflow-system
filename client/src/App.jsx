import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Toast from './components/Toast';
import DashboardLayout from './components/DashboardLayout';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import BuyerDashboard from './pages/BuyerDashboard';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';
import NotFoundPage from './pages/NotFoundPage';

function DashboardRedirect() {
  return (
    <ProtectedRoute>
      <Navigate to="/dashboard/buyer" replace />
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/products" element={<HomePage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/cart"
          element={
            <ProtectedRoute roles={['buyer']}>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute roles={['buyer', 'seller', 'admin']}>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute roles={['buyer', 'seller', 'admin']}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={['buyer', 'seller', 'admin']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardRedirect />} />
          <Route
            path="buyer"
            element={
              <ProtectedRoute roles={['buyer']}>
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="seller"
            element={
              <ProtectedRoute roles={['seller']}>
                <SellerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          path="/seller/products/new"
          element={
            <ProtectedRoute roles={['seller']}>
              <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <AddProductPage />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/products/:id/edit"
          element={
            <ProtectedRoute roles={['seller']}>
              <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <EditProductPage />
              </div>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
      <Toast />
    </div>
  );
}
