import PropTypes from 'prop-types';
import styles from './CategoryFilter.module.css';

export default function CategoryFilter({ categories, active, onChange }) {
  return (
    <div className={styles.filterBar}>
      {['All', ...categories].map((category) => (
        <button
          type="button"
          key={category}
          className={`${styles.filterButton} ${
            (active || 'All').toLowerCase() === category.toLowerCase() ? styles.active : ''
          }`}
          onClick={() => onChange(category === 'All' ? null : category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

CategoryFilter.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  active: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

CategoryFilter.defaultProps = {
  active: 'All',
};
