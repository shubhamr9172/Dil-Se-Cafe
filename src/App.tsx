import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { useStore } from './store';
import { dbService } from './services/db';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

import POSPage from './features/order/POSPage';
import MenuManagement from './features/menu/MenuManagement';
import KitchenDisplay from './features/kitchen/KitchenDisplay';
import OrdersPage from './features/order/OrdersPage';
import LoginPage from './features/auth/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';

// Placeholder Pages
// const Dashboard = () => <div className="text-2xl font-bold">Dashboard / POS</div>;
// const Orders = () => <div className="text-2xl font-bold">Orders History</div>;
const Settings = () => <div className="text-2xl font-bold">Settings</div>;

function App() {
  const { setMenuItems, setCategories, setOrders, user, setUser } = useStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, [setUser]);

  useEffect(() => {
    if (!user?.uid) return; // Don't subscribe if no user is logged in

    // Subscribe to Real-time updates with user scoping
    const unsubItems = dbService.subscribeToMenuItems(user.uid, setMenuItems);
    const unsubCats = dbService.subscribeToCategories(user.uid, setCategories);
    const unsubOrders = dbService.subscribeToOrders(user.uid, setOrders);

    return () => {
      unsubItems();
      unsubCats();
      unsubOrders();
    };
  }, [setMenuItems, setCategories, setOrders, user]);


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

        <Route path="/" element={
          <ProtectedRoute>
            <Layout>
              <POSPage />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/orders" element={
          <ProtectedRoute>
            <Layout>
              <OrdersPage />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/kitchen" element={
          <ProtectedRoute>
            <Layout>
              <KitchenDisplay />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/menu" element={
          <ProtectedRoute>
            <Layout>
              <MenuManagement />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/settings" element={
          <ProtectedRoute>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
