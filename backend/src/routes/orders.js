import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// Create order
router.post('/', async (req, res) => {
  try {
    const { customerId, cakeId, quantity, reservationDate } = req.body;

    if (!customerId || !cakeId || !quantity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check stock
    const cakeResult = await query('SELECT stock FROM cakes WHERE id = $1', [cakeId]);
    if (cakeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cake not found' });
    }

    if (cakeResult.rows[0].stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Create order
    const result = await query(
      'INSERT INTO orders (customer_id, cake_id, quantity, reservation_date, status) VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at',
      [customerId, cakeId, quantity, reservationDate, 'pending']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get orders by customer
router.get('/customer/:customerId', async (req, res) => {
  try {
    const result = await query(
      'SELECT o.*, c.name as cake_name, cust.email FROM orders o JOIN cakes c ON o.cake_id = c.id JOIN customers cust ON o.customer_id = cust.id WHERE o.customer_id = $1 ORDER BY o.created_at DESC',
      [req.params.customerId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

export default router;
