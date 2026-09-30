const sql = require('./_lib/db');
const { getUserId } = require('./_lib/auth');
const PRICE_KURUS_PER_1000 = 190; // ₺1.90 / 1000

module.exports = async (req, res) => {
  try {
    const uid = getUserId(req);
    if (!uid) return res.status(401).json({ error: 'Giriş yapmalısınız.' });

    if (req.method === 'GET') {
      const rows = await sql`SELECT id, link, quantity, cost, status, created_at FROM orders WHERE user_id = ${uid} ORDER BY id DESC LIMIT 50`;
      return res.json({ orders: rows });
    }
    if (req.method !== 'POST') return res.status(405).end();

    const { link, quantity } = req.body || {};
    const q = parseInt(quantity);
    if (!/^https:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[\w-]+/i.test(String(link || '')))
      return res.status(400).json({ error: 'Geçerli bir Instagram gönderi linki giriniz.' });
    if (!(q >= 1 && q <= 1000)) return res.status(400).json({ error: 'Miktar 1 ile 1000 arasında olmalıdır.' });

    const cost = Math.max(1, Math.ceil((q * PRICE_KURUS_PER_1000) / 1000));
    // Bakiye düşümü + sipariş kaydı tek atomik sorguda
    const r = await sql`
      WITH u AS (
        UPDATE users SET balance = balance - ${cost}::int
        WHERE id = ${uid} AND balance >= ${cost}::int
        RETURNING id, balance
      ), o AS (
        INSERT INTO orders (user_id, link, quantity, cost)
        SELECT id, ${link}::text, ${q}::int, ${cost}::int FROM u
        RETURNING id
      )
      SELECT u.balance, o.id FROM u, o`;
    if (!r.length) return res.status(402).json({ error: 'Yetersiz bakiye. Lütfen bakiye yükleyiniz.' });
    res.json({ orderId: r[0].id, balance: r[0].balance });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
};
