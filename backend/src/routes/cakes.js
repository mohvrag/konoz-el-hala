import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// Get all cakes
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT id, name, description, price, stock FROM cakes WHERE active = true ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cakes' });
  }
});

// Get cake by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM cakes WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cake not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cake' });
  }
});

export default router;
