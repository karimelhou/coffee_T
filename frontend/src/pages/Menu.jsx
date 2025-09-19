import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CategoryFilter from '../components/CategoryFilter.jsx';
import MenuCard from '../components/MenuCard.jsx';
import { fetchCategories, fetchMenu } from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';
import styles from './Menu.module.css';

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchMenu(activeCategory || undefined)
      .then((data) => {
        if (isMounted) {
          setItems(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('Unable to load the menu. Please try again shortly.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeCategory]);

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <motion.div
          className={styles.headerCard}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Our menu</h1>
          <p>
            Espresso classics, slow-steeped brews, botanical teas, and pastries baked fresh each morning.
            Every item is created with responsibly sourced ingredients and a dedication to artistry.
          </p>
        </motion.div>
      </section>

      <CategoryFilter
        categories={categories}
        active={activeCategory || 'All'}
        onChange={setActiveCategory}
      />

      {error && <p className={styles.error}>{error}</p>}

      <motion.div
        className={styles.grid}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {loading && <p>Pouring over the selections…</p>}
        {!loading && items.length === 0 && <p>No items available in this category yet.</p>}
        {!loading &&
          items.map((item) => <MenuCard key={item.id} item={item} onAdd={addItem} />)}
      </motion.div>
    </div>
  );
}
