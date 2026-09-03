import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { query } from '../db.js';

const router = express.Router();

// Register customer
router.post('/register', async (req, res) => {
  try {
    const { email, firstName, lastName, phone } = req.body;

    if (!email || !firstName || !lastName || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await query(
      'INSERT INTO customers (email, first_name, last_name, phone) VALUES ($1, $2, $3, $4) RETURNING id, email',
      [email, firstName, lastName, phone]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login customer
router.post('/login', async (req, res) => {
  try {
    const { email, phone } = req.body;

    const result = await query(
      'SELECT id, email, phone FROM customers WHERE email = $1 OR phone = $2',
      [email, phone]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const customer = result.rows[0];
    const token = jwt.sign({ id: customer.id, email: customer.email }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token, customer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
