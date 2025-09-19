import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import HomePage from './pages/Home.jsx';
import AboutPage from './pages/About.jsx';
import MenuPage from './pages/Menu.jsx';
import ContactPage from './pages/Contact.jsx';
import ShopPage from './pages/Shop.jsx';
import AdminPage from './pages/Admin.jsx';
import { CartProvider } from './context/CartContext.jsx';

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </CartProvider>
  );
}
