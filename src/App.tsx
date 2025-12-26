import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { useStore } from './store';
import { dbService } from './services/db';

import POSPage from './features/order/POSPage';
import MenuManagement from './features/menu/MenuManagement';
import KitchenDisplay from './features/kitchen/KitchenDisplay';
import OrdersPage from './features/order/OrdersPage';
import LoginPage from './features/auth/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

// Placeholder Pages
// const Dashboard = () => <div className="text-2xl font-bold">Dashboard / POS</div>;
// const Orders = () => <div className="text-2xl font-bold">Orders History</div>;
const Settings = () => <div className="text-2xl font-bold">Settings</div>;

function App() {
  const { setMenuItems, setCategories, setOrders } = useStore();

  useEffect(() => {
    // Subscribe to Real-time updates
    const unsubItems = dbService.subscribeToMenuItems(setMenuItems);
    const unsubCats = dbService.subscribeToCategories(setCategories);
    const unsubOrders = dbService.subscribeToOrders(setOrders);

    return () => {
      unsubItems();
      unsubCats();
      unsubOrders();
    };
  }, [setMenuItems, setCategories, setOrders]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

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
