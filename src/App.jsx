import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ArtworkProvider } from './context/ArtworkContext';

// Layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Chatbot from './components/chatbot/Chatbot';

// Pages
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import ArtworkDetail from './pages/ArtworkDetail';
import VirtualTour from './pages/VirtualTour';
import ExhibitionsDashboard from './pages/ExhibitionsDashboard';
import ExhibitionDetail from './pages/ExhibitionDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Dashboards
import AdminDashboard from './pages/dashboards/AdminDashboard';
import ArtistDashboard from './pages/dashboards/ArtistDashboard';
import ArtistUpload from './pages/dashboards/ArtistUpload';
import VisitorDashboard from './pages/dashboards/VisitorDashboard';
import CuratorDashboard from './pages/dashboards/CuratorDashboard';
import ShopDashboard from './pages/dashboards/ShopDashboard';
import CartDashboard from './pages/dashboards/CartDashboard';
import PaymentDashboard from './pages/dashboards/PaymentDashboard';
import VisitorProfile from './pages/dashboards/VisitorProfile';

// Styles
import './index.css';
import './styles/animations.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ArtworkProvider>
          <CartProvider>
            <div className="app">
              <Header />
              <main className="main-content">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/artwork/:id" element={<ArtworkDetail />} />
                  <Route path="/virtual-tour" element={<VirtualTour />} />
                  <Route path="/exhibitions" element={<ExhibitionsDashboard />} />
                  <Route path="/exhibitions/:id" element={<ExhibitionDetail />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />

                  {/* Protected Dashboard Routes */}
                  <Route path="/dashboard/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/dashboard/artist" element={<ProtectedRoute><ArtistDashboard /></ProtectedRoute>} />
                  <Route path="/dashboard/artist/upload" element={<ProtectedRoute><ArtistUpload /></ProtectedRoute>} />
                  <Route path="/artists" element={<ProtectedRoute><ArtistDashboard /></ProtectedRoute>} />
                  <Route path="/dashboard/visitor" element={<ProtectedRoute><VisitorDashboard /></ProtectedRoute>} />
                  <Route path="/dashboard/visitor/profile" element={<ProtectedRoute><VisitorProfile /></ProtectedRoute>} />
                  <Route path="/dashboard/curator" element={<ProtectedRoute><CuratorDashboard /></ProtectedRoute>} />
                  <Route path="/dashboard/shop" element={<ProtectedRoute><ShopDashboard /></ProtectedRoute>} />
                  <Route path="/shop" element={<ProtectedRoute><ShopDashboard /></ProtectedRoute>} />
                  <Route path="/cart" element={<ProtectedRoute><CartDashboard /></ProtectedRoute>} />
                  <Route path="/checkout" element={<ProtectedRoute><PaymentDashboard /></ProtectedRoute>} />
                </Routes>
              </main>
              <Footer />
              <Chatbot />
            </div>
          </CartProvider>
        </ArtworkProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
