import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay} />
      <motion.div
        className={styles.inner}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <p className={styles.kicker}>Welcome to Café Aroma</p>
        <h1>Boutique coffee crafted to awaken your senses</h1>
        <p className={styles.description}>
          From bean to cup, every sip celebrates ethical sourcing, small batch roasting,
          and the soulful rituals of the café. Relax, connect, and savor the moment.
        </p>
        <div className={styles.actions}>
          <Link to="/menu" className={styles.primary}>
            Explore the menu
          </Link>
          <Link to="/shop" className={styles.secondary}>
            Shop beans & pastries
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
