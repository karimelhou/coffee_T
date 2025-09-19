const fs = require('fs/promises');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const menuPath = path.join(dataDir, 'menu.json');
const ordersPath = path.join(dataDir, 'orders.json');

async function ensureFile(filePath, defaultValue) {
  try {
    await fs.access(filePath);
  } catch (error) {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(defaultValue, null, 2));
  }
}

async function readJSON(filePath, defaultValue = []) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data || 'null') ?? defaultValue;
  } catch (error) {
    if (error.code === 'ENOENT') {
      await ensureFile(filePath, defaultValue);
      return Array.isArray(defaultValue) ? [...defaultValue] : { ...defaultValue };
    }
    throw error;
  }
}

async function writeJSON(filePath, data) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

async function readMenu() {
  return readJSON(menuPath, []);
}

async function writeMenu(items) {
  return writeJSON(menuPath, items);
}

async function readOrders() {
  return readJSON(ordersPath, []);
}

async function writeOrders(orders) {
  return writeJSON(ordersPath, orders);
}

module.exports = {
  menuPath,
  ordersPath,
  readMenu,
  writeMenu,
  readOrders,
  writeOrders,
};
