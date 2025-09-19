import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaMugHot } from 'react-icons/fa';
import { FiMenu, FiX, FiShoppingBag } from 'react-icons/fi';
import styles from './NavBar.module.css';
import { useCart } from '../context/CartContext.jsx';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/menu', label: 'Menu' },
  { to: '/contact', label: 'Contact' },
  { to: '/shop', label: 'Shop' },
  { to: '/admin', label: 'Admin' },
];

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartCount } = useCart();

  const toggleMobile = () => setMobileOpen((prev) => !prev);
  const closeMobile = () => setMobileOpen(false);

  return (
    <header className={styles.navWrapper}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} onClick={closeMobile}>
          <FaMugHot className={styles.brandIcon} />
          <div>
            <span className={styles.brandTitle}>Café Aroma</span>
            <span className={styles.brandSubtitle}>Brewed with soul</span>
          </div>
        </Link>

        <button
          type="button"
          className={styles.mobileToggle}
          onClick={toggleMobile}
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>

        <nav className={`${styles.nav} ${mobileOpen ? styles.open : ''}`}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
              onClick={closeMobile}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <Link to="/shop" className={styles.cart} onClick={closeMobile}>
          <FiShoppingBag />
          <span className={styles.cartCount}>{cartCount}</span>
        </Link>
      </div>
    </header>
  );
}
