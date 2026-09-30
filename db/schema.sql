-- Neon (veya herhangi bir Postgres) SQL editöründe bir kez çalıştır.
-- Tüm tutarlar KURUŞ cinsindendir (₺10.00 = 1000).
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  balance INTEGER NOT NULL DEFAULT 0 CHECK (balance >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS deposits (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  oid TEXT UNIQUE NOT NULL,          -- sipariş/açıklama kodu
  method TEXT NOT NULL,              -- 'card' | 'iban'
  amount INTEGER NOT NULL CHECK (amount > 0),
  status TEXT NOT NULL DEFAULT 'pending', -- pending | paid | failed | rejected
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  link TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  cost INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | completed | cancelled
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS deposits_user ON deposits(user_id);
CREATE INDEX IF NOT EXISTS orders_user ON orders(user_id);
