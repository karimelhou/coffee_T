import { motion } from 'framer-motion';
import styles from './About.module.css';

const values = [
  {
    title: 'Intentional sourcing',
    description:
      'We visit partner farms annually, invest in long-term relationships, and pay above fair-trade rates to champion regenerative agriculture.',
  },
  {
    title: 'Craftsmanship',
    description:
      'Our baristas train for months on sensory science, latte art, and hospitality so every drink arrives with precision and warmth.',
  },
  {
    title: 'Community table',
    description:
      'From cupping classes to neighborhood fundraisers, our café is a gathering place where every story matters.',
  },
];

const milestones = [
  { year: '2016', detail: 'Café Aroma begins as a two-person espresso cart popping up at farmers markets.' },
  { year: '2018', detail: 'We roast our first micro-lot beans and open the flagship café in Portland.' },
  { year: '2020', detail: 'Launch of our online shop and virtual brewing workshops for coffee lovers everywhere.' },
  { year: '2023', detail: 'Expanded pastry program in collaboration with local artisan bakers.' },
];

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <section className={styles.intro}>
        <motion.div
          className={styles.introCard}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Our story is steeped in ritual</h1>
          <p>
            Café Aroma is a team of roasters, bakers, and hospitality pros who believe a cup of coffee can
            be a catalyst for connection. We source single-estate beans, roast in small batches, and craft
            beverages that honor the farmers who grew them. Every element—from ceramics to playlists—is
            curated to make you feel at home.
          </p>
        </motion.div>
        <motion.div
          className={styles.introImage}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80"
            alt="Guests enjoying coffee"
          />
        </motion.div>
      </section>

      <section className={styles.values}>
        <h2>What guides our craft</h2>
        <div className={styles.valuesGrid}>
          {values.map((value) => (
            <motion.article
              key={value.title}
              className={styles.valueCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4 }}
            >
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className={styles.milestones}>
        <h2>The road so far</h2>
        <div className={styles.timeline}>
          {milestones.map((milestone) => (
            <motion.div
              key={milestone.year}
              className={styles.timelineItem}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4 }}
            >
              <span className={styles.year}>{milestone.year}</span>
              <p>{milestone.detail}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
