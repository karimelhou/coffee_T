import { FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa';
import styles from './Footer.module.css';

const socials = [
  { icon: <FaInstagram />, label: 'Instagram', href: 'https://instagram.com' },
  { icon: <FaFacebookF />, label: 'Facebook', href: 'https://facebook.com' },
  { icon: <FaTwitter />, label: 'Twitter', href: 'https://twitter.com' },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <h3>Café Aroma</h3>
          <p>
            125 Brew Street, Portland, OR
            <br />
            hello@cafearoma.com • (503) 555-0142
          </p>
        </div>
        <div className={styles.hours}>
          <h4>Hours</h4>
          <p>
            Monday – Friday: 7am – 7pm
            <br />
            Saturday – Sunday: 8am – 6pm
          </p>
        </div>
        <div className={styles.socials}>
          <h4>Stay connected</h4>
          <div className={styles.socialIcons}>
            {socials.map((social) => (
              <a key={social.label} href={social.href} aria-label={social.label}>
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
      <p className={styles.copy}>
        © {new Date().getFullYear()} Café Aroma. Crafted with love for coffee enthusiasts.
      </p>
    </footer>
  );
}
