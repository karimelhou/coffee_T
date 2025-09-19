import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import styles from './MenuCard.module.css';

export default function MenuCard({ item, onAdd }) {
  return (
    <motion.article
      className={styles.card}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <div className={styles.imageWrapper}>
        <img src={item.image} alt={item.name} loading="lazy" />
        <span className={styles.category}>{item.category}</span>
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <h3>{item.name}</h3>
          <span className={styles.price}>${item.price.toFixed(2)}</span>
        </div>
        <p className={styles.description}>{item.description}</p>
        <button type="button" onClick={() => onAdd(item)} className={styles.button}>
          Add to cart
        </button>
      </div>
    </motion.article>
  );
}

MenuCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  onAdd: PropTypes.func.isRequired,
};
