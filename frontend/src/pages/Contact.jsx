import { motion } from 'framer-motion';
import styles from './Contact.module.css';

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <motion.div
          className={styles.headerCard}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Let&apos;s connect</h1>
          <p>
            Whether you&apos;re planning a private tasting, curious about wholesale, or simply want to say hi,
            we&apos;d love to hear from you. Drop us a note and our hospitality team will respond within one
            business day.
          </p>
        </motion.div>
      </section>

      <section className={styles.grid}>
        <motion.div
          className={styles.contactCard}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <h2>Visit us</h2>
          <p>125 Brew Street, Portland, OR 97205</p>
          <p>hello@cafearoma.com</p>
          <p>(503) 555-0142</p>

          <div className={styles.hours}>
            <h3>Hours</h3>
            <p>
              Monday – Friday: 7am – 7pm
              <br />
              Saturday – Sunday: 8am – 6pm
            </p>
          </div>

          <div className={styles.mapWrapper}>
            <iframe
              title="Café Aroma location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2795.961344503109!2d-122.68189552352887!3d45.52279323235841!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54950a0297874e1f%3A0x3a2a1430df2a4e9!2sPortland%20Coffee%20Roasters!5e0!3m2!1sen!2sus!4v1700000000000"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </motion.div>

        <motion.form
          className={styles.form}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={(event) => event.preventDefault()}
        >
          <h2>Send us a note</h2>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" placeholder="Your name" required />

          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" placeholder="you@email.com" required />

          <label htmlFor="message">How can we help?</label>
          <textarea id="message" name="message" rows="5" placeholder="Tell us about your event..." required />

          <button type="submit">Send message</button>
          <p className={styles.formHint}>
            This demo form showcases styling only. For inquiries please email hello@cafearoma.com.
          </p>
        </motion.form>
      </section>
    </div>
  );
}
