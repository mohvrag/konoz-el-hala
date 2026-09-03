-- Create tables
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cakes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  color_1 VARCHAR(7),
  color_2 VARCHAR(7),
  color_3 VARCHAR(7),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_id INT NOT NULL REFERENCES customers(id),
  cake_id INT NOT NULL REFERENCES cakes(id),
  quantity INT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  reservation_date DATE,
  total_price DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample cakes
INSERT INTO cakes (name, description, price, stock, color_1, color_2, color_3) VALUES
  ('Fraisier Royal', 'Fraises fraîches, crème mousseline vanille, biscuit léger.', 350, 24, '#e79aa0', '#c46a72', '#8a3f47'),
  ('Number Cake Chocolat', 'Sablé cacao, ganache chocolat, fruits rouges de saison.', 400, 18, '#a9765a', '#7a4c34', '#4b2c1c'),
  ('Tarte Citron Meringuée', 'Crème citron acidulée, meringue italienne dorée.', 320, 20, '#f3dd7f', '#e0b94a', '#a8842a'),
  ('Cheesecake Caramel Beurre Salé', 'Cheesecake crémeux, coulis caramel au beurre salé.', 380, 15, '#e7c48a', '#c99a54', '#8a6329'),
  ('Red Velvet', 'Biscuit velours rouge, glaçage cream cheese.', 400, 16, '#c96a6f', '#9b3a3f', '#5e2023'),
  ('Opéra Pistache', 'Biscuit joconde, ganache pistache et chocolat noir.', 420, 12, '#a9c08a', '#7d9a5c', '#4d6136'),
  ('Kunafa Halawiyat', 'Cheveux d''ange dorés, fromage fondant, sirop parfumé.', 450, 20, '#f0c96a', '#d4a13a', '#9c701f'),
  ('Boîte de Macarons', 'Assortiment maison de 6 saveurs, la boîte.', 250, 30, '#e3b8cf', '#c98cae', '#8c5670');

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_cake ON orders(cake_id);
CREATE INDEX idx_orders_status ON orders(status);
