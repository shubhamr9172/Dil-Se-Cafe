import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import LoginPage from './features/auth/LoginPage';
import POSPage from './features/order/POSPage';
import OrdersPage from './features/order/OrdersPage';
import KitchenDisplay from './features/kitchen/KitchenDisplay';
import MenuManagement from './features/menu/MenuManagement';
import AnalyticsPage from './features/analytics/AnalyticsPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import { useStore } from './store';
import { dbService } from './services/db';

function App() {
  const { setUser, setInitialized, setMenuItems, setCategories, setOrders, user } = useStore();

  useEffect(() => {
    // Check for MojoAuth token on app load
    const token = localStorage.getItem('mojoauth_token');
    const userStr = localStorage.getItem('mojoauth_user');

    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        // Create a user object with uid for Firestore compatibility
        const mojoUser = {
          uid: userData.email || userData.identifier || 'default-user',
          email: userData.email,
          ...userData
        };
        setUser(mojoUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUser(null);
      }
    } else {
      setUser(null);
    }

    setInitialized(true);
  }, [setUser, setInitialized]);

  // Subscribe to Firestore data when user is authenticated
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribeMenuItems = dbService.subscribeToMenuItems(user.uid, setMenuItems);
    const unsubscribeCategories = dbService.subscribeToCategories(user.uid, setCategories);
    const unsubscribeOrders = dbService.subscribeToOrders(user.uid, setOrders);

    return () => {
      unsubscribeMenuItems();
      unsubscribeCategories();
      unsubscribeOrders();
    };
  }, [user, setMenuItems, setCategories, setOrders]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<POSPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/kitchen" element={<KitchenDisplay />} />
                  <Route path="/menu" element={<MenuManagement />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/settings" element={<div className="text-2xl font-bold">Settings (Coming Soon)</div>} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
