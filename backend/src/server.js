require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { v4: uuid } = require('uuid');
const {
  readMenu,
  writeMenu,
  readOrders,
  writeOrders,
} = require('./storage');

const app = express();
const PORT = process.env.PORT || 4000;
const TAX_RATE = Number(process.env.TAX_RATE ?? 0.07);
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'password123';

app.use(cors());
app.use(express.json());

function adminAuth(req, res, next) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Basic ')) {
    return res.status(401).json({ message: 'Admin authentication required' });
  }
  const decoded = Buffer.from(header.replace('Basic ', ''), 'base64').toString();
  const [username, password] = decoded.split(':');

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return next();
  }

  return res.status(403).json({ message: 'Invalid administrator credentials' });
}

const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

function normalisePrice(value) {
  return Math.round(Number(value) * 100) / 100;
}

function buildCartSummary(requestedItems, menuItems) {
  const detailedItems = [];
  let subtotalCents = 0;

  requestedItems.forEach(({ id, quantity }) => {
    const menuItem = menuItems.find((item) => item.id === id);
    if (!menuItem) {
      throw new Error(`Menu item with id ${id} not found`);
    }
    const qty = Number(quantity);
    if (!Number.isFinite(qty) || qty <= 0) {
      throw new Error(`Invalid quantity for item ${menuItem?.name || id}`);
    }

    const lineSubtotal = normalisePrice(menuItem.price) * qty;
    subtotalCents += Math.round(lineSubtotal * 100);
    detailedItems.push({
      id: menuItem.id,
      name: menuItem.name,
      price: normalisePrice(menuItem.price),
      quantity: qty,
      image: menuItem.image,
      category: menuItem.category,
      description: menuItem.description,
      lineTotal: Math.round(lineSubtotal * 100) / 100,
    });
  });

  const subtotal = Math.round(subtotalCents) / 100;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  return {
    items: detailedItems,
    subtotal,
    tax,
    taxRate: TAX_RATE,
    total,
  };
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get(
  '/api/menu',
  asyncHandler(async (req, res) => {
    const items = await readMenu();
    const { category } = req.query;

    if (category) {
      const filtered = items.filter(
        (item) => item.category.toLowerCase() === String(category).toLowerCase()
      );
      return res.json(filtered);
    }

    res.json(items);
  })
);

app.get(
  '/api/menu/categories',
  asyncHandler(async (req, res) => {
    const items = await readMenu();
    const categories = Array.from(new Set(items.map((item) => item.category))).sort();
    res.json(categories);
  })
);

app.get(
  '/api/menu/:id',
  asyncHandler(async (req, res) => {
    const items = await readMenu();
    const menuItem = items.find((item) => item.id === req.params.id);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json(menuItem);
  })
);

app.post(
  '/api/menu',
  adminAuth,
  asyncHandler(async (req, res) => {
    const { name, description, price, category, image } = req.body;

    if (!name || !description || !price || !category || !image) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const items = await readMenu();
    const newItem = {
      id: uuid(),
      name,
      description,
      price: normalisePrice(price),
      category,
      image,
      createdAt: new Date().toISOString(),
    };

    items.push(newItem);
    await writeMenu(items);

    res.status(201).json(newItem);
  })
);

app.put(
  '/api/menu/:id',
  adminAuth,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const items = await readMenu();
    const index = items.findIndex((item) => item.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    const updatedItem = {
      ...items[index],
      ...req.body,
      price: req.body.price ? normalisePrice(req.body.price) : items[index].price,
      updatedAt: new Date().toISOString(),
    };

    items[index] = updatedItem;
    await writeMenu(items);

    res.json(updatedItem);
  })
);

app.delete(
  '/api/menu/:id',
  adminAuth,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const items = await readMenu();
    const nextItems = items.filter((item) => item.id !== id);

    if (nextItems.length === items.length) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    await writeMenu(nextItems);
    res.status(204).send();
  })
);

app.post(
  '/api/cart',
  asyncHandler(async (req, res) => {
    const { items: requestedItems } = req.body;
    if (!Array.isArray(requestedItems) || requestedItems.length === 0) {
      return res.status(400).json({ message: 'Cart items are required' });
    }

    const menuItems = await readMenu();
    const summary = buildCartSummary(requestedItems, menuItems);
    res.json(summary);
  })
);

app.post(
  '/api/orders',
  asyncHandler(async (req, res) => {
    const { customer, items: requestedItems, notes } = req.body;

    if (!customer || !requestedItems) {
      return res.status(400).json({ message: 'Customer details and items are required' });
    }

    const requiredCustomerFields = ['name', 'email', 'phone', 'address'];
    const missingField = requiredCustomerFields.find((field) => !customer[field]);
    if (missingField) {
      return res.status(400).json({ message: `Missing customer field: ${missingField}` });
    }

    const menuItems = await readMenu();
    const summary = buildCartSummary(requestedItems, menuItems);

    const orders = await readOrders();
    const order = {
      id: uuid(),
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
      },
      notes: notes || '',
      ...summary,
      createdAt: new Date().toISOString(),
    };

    orders.push(order);
    await writeOrders(orders);

    res.status(201).json(order);
  })
);

app.get(
  '/api/orders',
  adminAuth,
  asyncHandler(async (req, res) => {
    const orders = await readOrders();
    res.json(orders);
  })
);

app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ message: 'Internal server error', detail: err.message });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Café Aroma API listening on port ${PORT}`);
});
