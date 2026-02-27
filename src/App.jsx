import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

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

                {/* Dashboard Routes */}
                <Route path="/dashboard/admin" element={<AdminDashboard />} />
                <Route path="/dashboard/artist" element={<ArtistDashboard />} />
                <Route path="/artists" element={<ArtistDashboard />} />
                <Route path="/dashboard/visitor" element={<VisitorDashboard />} />
                <Route path="/dashboard/visitor/profile" element={<VisitorProfile />} />
                <Route path="/dashboard/curator" element={<CuratorDashboard />} />
                <Route path="/dashboard/shop" element={<ShopDashboard />} />
                <Route path="/shop" element={<ShopDashboard />} />
                <Route path="/cart" element={<CartDashboard />} />
                <Route path="/checkout" element={<PaymentDashboard />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
