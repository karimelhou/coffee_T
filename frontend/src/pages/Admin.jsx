import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  adminCreateMenuItem,
  adminDeleteMenuItem,
  adminFetchOrders,
  apiHelpers,
  fetchMenu,
} from '../services/api.js';
import styles from './Admin.module.css';

const emptyItem = {
  name: '',
  description: '',
  price: '',
  category: '',
  image: '',
};

export default function AdminPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [authToken, setAuthToken] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [newItem, setNewItem] = useState(emptyItem);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMenu()
      .then((data) => setMenuItems(data))
      .catch(() => setMenuItems([]));
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(menuItems.map((item) => item.category))).sort(),
    [menuItems]
  );

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setLoginError(null);
    setStatusMessage(null);

    try {
      const token = apiHelpers.buildBasicToken(loginForm.username, loginForm.password);
      const response = await adminFetchOrders(token);
      setAuthToken(token);
      setOrders(response);
      setStatusMessage('Administrator access granted. Manage your menu below.');
    } catch (error) {
      setLoginError(error.message || 'Unable to authenticate with the provided credentials.');
      setAuthToken(null);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewItemChange = (event) => {
    const { name, value } = event.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateItem = async (event) => {
    event.preventDefault();
    if (!authToken) {
      setLoginError('Please sign in as an administrator first.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...newItem,
        price: parseFloat(newItem.price),
      };
      const created = await adminCreateMenuItem(payload, authToken);
      setMenuItems((prev) => [...prev, created]);
      setNewItem(emptyItem);
      setStatusMessage(`Menu item "${created.name}" added successfully.`);
    } catch (error) {
      setStatusMessage(null);
      setLoginError(error.message || 'Unable to create menu item.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!authToken) {
      setLoginError('Please sign in as an administrator first.');
      return;
    }
    if (!window.confirm('Delete this menu item?')) {
      return;
    }

    try {
      setLoading(true);
      await adminDeleteMenuItem(id, authToken);
      setMenuItems((prev) => prev.filter((item) => item.id !== id));
      setStatusMessage('Menu item deleted successfully.');
    } catch (error) {
      setStatusMessage(null);
      setLoginError(error.message || 'Unable to delete menu item.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <h1>Administrator portal</h1>
        <p>Manage your Café Aroma menu and view recent orders.</p>

        <form className={styles.loginForm} onSubmit={handleLoginSubmit}>
          <h2>Admin sign in</h2>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            autoComplete="username"
            value={loginForm.username}
            onChange={(event) =>
              setLoginForm((prev) => ({ ...prev, username: event.target.value }))
            }
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={loginForm.password}
            onChange={(event) =>
              setLoginForm((prev) => ({ ...prev, password: event.target.value }))
            }
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Authenticating…' : 'Sign in'}
          </button>
        </form>

        {loginError && <p className={styles.error}>{loginError}</p>}
        {statusMessage && <p className={styles.success}>{statusMessage}</p>}
      </section>

      {authToken && (
        <section className={styles.card}>
          <h2>Add a menu item</h2>
          <form className={styles.itemForm} onSubmit={handleCreateItem}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              value={newItem.name}
              onChange={handleNewItemChange}
              required
            />

            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={newItem.description}
              onChange={handleNewItemChange}
              required
            />

            <label htmlFor="price">Price</label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={newItem.price}
              onChange={handleNewItemChange}
              required
            />

            <label htmlFor="category">Category</label>
            <input
              id="category"
              name="category"
              list="category-list"
              value={newItem.category}
              onChange={handleNewItemChange}
              required
            />
            <datalist id="category-list">
              {categories.map((category) => (
                <option value={category} key={category} />
              ))}
            </datalist>

            <label htmlFor="image">Image URL</label>
            <input
              id="image"
              name="image"
              value={newItem.image}
              onChange={handleNewItemChange}
              placeholder="https://…"
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Saving…' : 'Create item'}
            </button>
          </form>
        </section>
      )}

      <section className={styles.card}>
        <h2>Current menu</h2>
        <div className={styles.menuGrid}>
          {menuItems.map((item) => (
            <motion.article key={item.id} className={styles.menuItem} layout>
              <img src={item.image} alt={item.name} />
              <div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <span className={styles.meta}>
                  {item.category} • ${item.price.toFixed(2)}
                </span>
              </div>
              {authToken && (
                <button
                  type="button"
                  onClick={() => handleDeleteItem(item.id)}
                  className={styles.delete}
                >
                  Remove
                </button>
              )}
            </motion.article>
          ))}
        </div>
      </section>

      {authToken && (
        <section className={styles.card}>
          <h2>Recent orders</h2>
          {orders.length === 0 ? (
            <p>No orders have been placed yet.</p>
          ) : (
            <div className={styles.orders}>
              {orders
                .slice()
                .reverse()
                .map((order) => (
                  <article key={order.id} className={styles.orderCard}>
                    <header>
                      <h3>Order #{order.id.slice(0, 8)}</h3>
                      <span>{new Date(order.createdAt).toLocaleString()}</span>
                    </header>
                    <p>
                      {order.customer.name} • {order.customer.email}
                      <br />
                      {order.customer.phone}
                    </p>
                    <p>{order.customer.address}</p>
                    <ul>
                      {order.items.map((item) => (
                        <li key={item.id}>
                          {item.quantity} × {item.name} — ${item.lineTotal.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                    <footer>
                      Total: ${order.total.toFixed(2)}
                    </footer>
                  </article>
                ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
