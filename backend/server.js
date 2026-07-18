require('dotenv').config();
const express = require('express');
const cors = require('cors');
const QRCode = require('qrcode');
const { connectDB, getMenuItems, addMenuItem, getReservations, addReservation } = require('./utils/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// 1. Health/Status Check
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    appName: "Kimaya's Kitchen Backend",
    timestamp: new Date().toISOString(),
    databaseMode: require('./utils/db').useMongo() ? 'MongoDB' : 'Local JSON File'
  });
});

// 2. Menu Items
app.get('/api/menu', async (req, res) => {
  try {
    const items = await getMenuItems();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve menu items: ' + err.message });
  }
});

// Add new menu item (for easy customization)
app.post('/api/menu', async (req, res) => {
  try {
    const { name, description, price, category, image, tags, available } = req.body;
    if (!name || !description || price === undefined || !category) {
      return res.status(400).json({ error: 'Please provide name, description, price, and category.' });
    }
    const item = await addMenuItem({ name, description, price: Number(price), category, image, tags, available });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add menu item: ' + err.message });
  }
});

// 3. Reservations
app.get('/api/reservations', async (req, res) => {
  try {
    const reservations = await getReservations();
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve reservations: ' + err.message });
  }
});

app.post('/api/reservations', async (req, res) => {
  try {
    const { name, email, phone, date, time, guests, specialRequests } = req.body;
    if (!name || !email || !phone || !date || !time || !guests) {
      return res.status(400).json({ error: 'Please provide name, email, phone, date, time, and guests count.' });
    }
    const resData = await addReservation({
      name,
      email,
      phone,
      date,
      time,
      guests: Number(guests),
      specialRequests
    });
    res.status(201).json({ message: 'Reservation successfully created!', data: resData });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create reservation: ' + err.message });
  }
});

// 4. QR Code Generator
app.get('/api/qr', async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({ error: 'Query parameter "url" is required.' });
  }
  try {
    // Generate QR Code as Data URL
    const qrCodeDataUrl = await QRCode.toDataURL(url, {
      color: {
        dark: '#DFB05B', // Luxury Gold
        light: '#141414' // Dark Obsidian
      },
      width: 400,
      margin: 2
    });
    res.json({ qrCodeDataUrl });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate QR Code: ' + err.message });
  }
});

// Start Server & Connect Database
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectDB();
});
