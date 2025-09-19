import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaSeedling, FaWifi, FaHeart } from 'react-icons/fa';
import Hero from '../components/Hero.jsx';
import MenuCard from '../components/MenuCard.jsx';
import { fetchMenu } from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';
import styles from './Home.module.css';

const features = [
  {
    icon: <FaSeedling />,
    title: 'Farm-direct sourcing',
    description:
      'We collaborate with women-led cooperatives to bring transparent, sustainable beans to your cup.',
  },
  {
    icon: <FaLeaf />,
    title: 'Seasonal roasting',
    description:
      'Our roastmasters profile each harvest in small batches to preserve nuanced aromas and sweetness.',
  },
  {
    icon: <FaWifi />,
    title: 'Third-space vibes',
    description:
      'Thoughtful playlists, warm lighting, and plenty of cozy corners for connection or focus.',
  },
  {
    icon: <FaHeart />,
    title: 'Community first',
    description:
      'Monthly cupping labs, latte art throwdowns, and partnerships with local bakers and makers.',
  },
];

export default function HomePage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    let isMounted = true;

    async function loadMenu() {
      try {
        const data = await fetchMenu();
        if (isMounted) {
          setFavorites(data.slice(0, 3));
        }
      } catch (err) {
        if (isMounted) {
          setError('Unable to load featured drinks.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadMenu();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className={styles.page}>
      <Hero />

      <section className={styles.features}>
        <h2>Slow down and sip the difference</h2>
        <p className={styles.subtitle}>
          Crafted rituals, sensory storytelling, and ethically-sourced flavors designed to brighten every
          day.
        </p>
        <div className={styles.featureGrid}>
          {features.map((feature) => (
            <motion.article
              key={feature.title}
              className={styles.featureCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
            >
              <span className={styles.featureIcon}>{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className={styles.favorites}>
        <div className={styles.sectionHeader}>
          <h2>Signature pours & fresh bakes</h2>
          <p>Our guests can&apos;t get enough of these curated, seasonal favorites.</p>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.menuGrid}>
          {loading && <p>Brewing up recommendations…</p>}
          {!loading &&
            favorites.map((item) => <MenuCard key={item.id} item={item} onAdd={addItem} />)}
        </div>
      </section>

      <section className={styles.story}>
        <div className={styles.storyContent}>
          <h2>Handcrafted hospitality</h2>
          <p>
            Café Aroma was born from a traveling espresso cart and a dream of creating a home away from
            home for makers, dreamers, and neighbors. Our menu pays homage to global coffee traditions
            while showcasing Pacific Northwest ingredients.
          </p>
          <p>
            Whether you&apos;re savoring single-origin espresso, discovering house-made syrups, or picking up
            a pastry for the office, we invite you to linger, laugh, and be part of the ritual.
          </p>
        </div>
        <div className={styles.storyImage}>
          <img
            src="https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?auto=format&fit=crop&w=900&q=80"
            alt="Barista pouring latte art"
          />
        </div>
      </section>
    </div>
  );
}
