import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import { createOrder } from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';
import styles from './Shop.module.css';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  address: '',
  notes: '',
};

export default function ShopPage() {
  const { items, summary, updateQuantity, removeItem, clearCart, isSyncing, error: cartError } =
    useCart();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [orderError, setOrderError] = useState(null);

  const detailedItems = useMemo(
    () =>
      items.map((item) => {
        const enriched = summary.items?.find((summaryItem) => summaryItem.id === item.id);
        return {
          ...item,
          price: enriched?.price ?? item.price,
          lineTotal: enriched?.lineTotal ?? item.price * item.quantity,
        };
      }),
    [items, summary.items]
  );

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setOrderError(null);
    setOrderSuccess(null);

    if (items.length === 0) {
      setOrderError('Your cart is empty. Add a few treats before checking out.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        customer: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
        },
        notes: form.notes,
        items: items.map((item) => ({ id: item.id, quantity: item.quantity })),
      };
      const order = await createOrder(payload);
      setOrderSuccess(`Thank you ${order.customer.name}! Your order #${order.id.slice(0, 6)} has been received.`);
      setForm(initialForm);
      clearCart();
    } catch (error) {
      setOrderError(error.message || 'We could not place your order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <section className={styles.cartSection}>
        <div className={styles.cartHeader}>
          <h1>Shop Café Aroma</h1>
          <p>Collect your favorite beans, signature syrups, and pastries for at-home indulgence.</p>
        </div>

        {cartError && <p className={styles.error}>{cartError}</p>}
        {orderError && <p className={styles.error}>{orderError}</p>}
        {orderSuccess && <p className={styles.success}>{orderSuccess}</p>}

        {items.length === 0 ? (
          <p className={styles.empty}>Your cart is empty. Browse the menu to start adding delights.</p>
        ) : (
          <div className={styles.cartList}>
            {detailedItems.map((item) => (
              <motion.div
                key={item.id}
                className={styles.cartItem}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.itemInfo}>
                  <img src={item.image} alt={item.name} />
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
                <div className={styles.itemActions}>
                  <div className={styles.quantityControls}>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      aria-label={`Decrease ${item.name} quantity`}
                    >
                      <FiMinus />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label={`Increase ${item.name} quantity`}
                    >
                      <FiPlus />
                    </button>
                  </div>
                  <span className={styles.price}>${item.lineTotal.toFixed(2)}</span>
                  <button
                    type="button"
                    className={styles.remove}
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section className={styles.checkoutSection}>
        <div className={styles.summaryBox}>
          <h2>Order summary</h2>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>${summary.subtotal.toFixed(2)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Tax ({Math.round(summary.taxRate * 100)}%)</span>
            <span>${summary.tax.toFixed(2)}</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.totalRow}`}>
            <span>Total</span>
            <span>${summary.total.toFixed(2)}</span>
          </div>
          <p className={styles.note}>
            Taxes are calculated according to local regulations. Payment is processed safely in store upon
            pickup.
          </p>
        </div>

        <form className={styles.checkoutForm} onSubmit={handleSubmit}>
          <h2>Checkout</h2>
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            name="name"
            required
            placeholder="Avery Barista"
            value={form.name}
            onChange={handleInputChange}
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            value={form.email}
            onChange={handleInputChange}
          />

          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            required
            placeholder="(555) 123-4567"
            value={form.phone}
            onChange={handleInputChange}
          />

          <label htmlFor="address">Pickup or delivery address</label>
          <textarea
            id="address"
            name="address"
            rows="3"
            required
            placeholder="123 Coffee Lane, Portland, OR"
            value={form.address}
            onChange={handleInputChange}
          />

          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            rows="3"
            placeholder="Any dietary preferences or pickup time?"
            value={form.notes}
            onChange={handleInputChange}
          />

          <button type="submit" disabled={submitting || items.length === 0 || isSyncing}>
            {submitting ? 'Submitting order…' : 'Place order'}
          </button>
          {isSyncing && <p className={styles.syncing}>Refreshing totals…</p>}
        </form>
      </section>
    </div>
  );
}
