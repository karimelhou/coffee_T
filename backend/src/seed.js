const { v4: uuid } = require('uuid');
const { writeMenu, writeOrders } = require('./storage');

const menuItems = [
  {
    id: uuid(),
    name: 'Classic Espresso',
    description: 'Rich and bold espresso shot brewed with locally roasted beans.',
    price: 3.25,
    category: 'Coffee',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: uuid(),
    name: 'Velvet Latte',
    description: 'Silky steamed milk over double espresso with subtle vanilla.',
    price: 4.75,
    category: 'Coffee',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: uuid(),
    name: 'Mocha Indulgence',
    description: 'Espresso blended with house-made chocolate sauce and whipped cream.',
    price: 5.1,
    category: 'Coffee',
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: uuid(),
    name: 'Cinnamon Cappuccino',
    description: 'Foamy cappuccino topped with a dusting of spiced cinnamon.',
    price: 4.5,
    category: 'Coffee',
    image: 'https://images.unsplash.com/photo-1518057111178-44a106bad636?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: uuid(),
    name: 'Cold Brew Tonic',
    description: 'Slow-steeped cold brew served over artisan tonic with citrus twist.',
    price: 4.95,
    category: 'Cold Drinks',
    image: 'https://images.unsplash.com/photo-1481391032119-d89fee407e44?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: uuid(),
    name: 'Matcha Garden Latte',
    description: 'Ceremonial-grade matcha whisked with oat milk and honey.',
    price: 5.4,
    category: 'Tea',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: uuid(),
    name: 'Almond Butter Croissant',
    description: 'Flaky croissant filled with toasted almond butter and dusted sugar.',
    price: 3.95,
    category: 'Pastry',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: uuid(),
    name: 'Seasonal Berry Tart',
    description: 'Buttery tart shell with mascarpone cream and market berries.',
    price: 4.75,
    category: 'Pastry',
    image: 'https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?auto=format&fit=crop&w=800&q=80',
  },
];

async function seed() {
  await writeMenu(menuItems);
  await writeOrders([]);
  // eslint-disable-next-line no-console
  console.log('Seed data generated for Café Aroma.');
}

seed().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to seed data', error);
  process.exit(1);
});
