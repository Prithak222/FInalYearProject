import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Navbar } from './components/navbar'
import { VendorNavbarWrapper } from './components/VendorNavBarWrapper'
import { AdminNavbarWrapper } from './components/AdminNavbarWrapper'
import { Home } from './pages/home'
import { Login } from './pages/login'
import { Register } from './pages/register'
import { Categories } from './pages/categories'
import { AuthProvider, useAuth } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import { ForgotPassword } from './pages/ForgotPassword'

import { VendorLogin } from './pages/vendor/VendorLogin'
import { VendorForgotPassword } from './pages/vendor/VendorForgotPassword'
import { VendorRegister } from './pages/vendor/VendorRegister'
import { VendorDashboard } from './pages/vendor/VendorDashboard'
import { VendorProducts } from './pages/vendor/VendorProducts'
import { PostItem, PostItem as VendorPost } from './pages/vendor/VendorPost'
import { VendorProfile } from './pages/vendor/VendorProfile'
import { default as VendorOrders } from './pages/vendor/VendorOrder'
import { AdminDashboard } from './pages/admin/adminDashboard'
import { Users } from './pages/admin/user'
import { Vendors } from './pages/admin/vendor'
import { Verification } from './pages/admin/verification'
import Listings from './pages/admin/listing'
import { Profile } from './pages/Profile'
import { ProductDetail } from './pages/ProductDetail'
import { ShopDetail } from './pages/ShopDetail'
import { Wishlist } from './pages/Wishlist'
import { ToastProvider } from './context/ToastContext'

import { Cart } from './pages/Cart'
import { Checkout } from './pages/Checkout'
import { OrderSuccess } from './pages/OrderSuccess'
import { MyOrders } from './pages/MyOrders'
import { Messages } from './pages/Messages'
import { VendorChat } from './pages/vendor/VendorChat'


function NavbarWrapper() {
  const { userRole } = useAuth()
  const location = useLocation()
  const path = location.pathname
  const hideNavbarPaths = ['/login', '/register', '/forgot-password', '/vendor/forgot-password', '/vendor/login', '/vendor/register']

  // Hide on auth paths OR when explicitly in a portal route
  if (
    hideNavbarPaths.includes(path) ||
    path.startsWith('/vendor') ||
    path.startsWith('/admin')
  ) {
    return null
  }
  return <Navbar />
}

import { Navigate, useLocation as useRouteLocation } from 'react-router-dom'

function ProtectedRoute({ allowedRole, children }) {
  const { isLoggedIn, userRole, loading } = useAuth()
  const location = useRouteLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isLoggedIn) {
    // Redirect to the appropriate login page, saving the attempted URL
    const loginPath = allowedRole === 'vendor' ? '/vendor/login' : '/login'
    return <Navigate to={loginPath} state={{ from: location }} replace />
  }

  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/" replace />
  }


  return children
}

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <ToastProvider>
        <BrowserRouter>
          <NavbarWrapper />
          <VendorNavbarWrapper /> {/* Vendor sidebar/navbar */}
          <AdminNavbarWrapper />


          <Routes>

          {/* Customer routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/shop/:id" element={<ShopDetail />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-success"
            element={
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-orders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />


          {/* Vendor routes */}
          <Route path="/vendor/login" element={<VendorLogin />} />
          <Route path="/vendor/register" element={<VendorRegister />} />
          <Route path="/vendor/forgot-password" element={<VendorForgotPassword />} />
          <Route
            path="/vendor/dashboard"
            element={
              <ProtectedRoute allowedRole="vendor">
                <VendorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/products"
            element={
              <ProtectedRoute allowedRole="vendor">
                <VendorProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/orders"
            element={
              <ProtectedRoute allowedRole="vendor">
                <VendorOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/post"
            element={
              <ProtectedRoute allowedRole="vendor">
                <PostItem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/profile"
            element={
              <ProtectedRoute allowedRole="vendor">
                <VendorProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/edit/:id"
            element={
              <ProtectedRoute allowedRole="vendor">
                <PostItem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/chat"
            element={
              <ProtectedRoute allowedRole="vendor">
                <VendorChat />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRole="admin">
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/vendors"
            element={
              <ProtectedRoute allowedRole="admin">
                <Vendors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/verification"
            element={
              <ProtectedRoute allowedRole="admin">
                <Verification />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/listings"
            element={
              <ProtectedRoute allowedRole="admin">
                <Listings />
              </ProtectedRoute>
            }
          />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </SocketProvider>
  </AuthProvider>

  )
}

export default App
