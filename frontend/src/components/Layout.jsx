import PropTypes from 'prop-types';
import styles from './Layout.module.css';
import NavBar from './NavBar.jsx';
import Footer from './Footer.jsx';
import ScrollToTop from './ScrollToTop.jsx';

export default function Layout({ children }) {
  return (
    <div className={styles.appShell}>
      <ScrollToTop />
      <NavBar />
      <main className={styles.mainContent}>{children}</main>
      <Footer />
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
