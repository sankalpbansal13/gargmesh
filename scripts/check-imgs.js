const db = require('../src/db');
const rows = db.prepare(`
  SELECT p.slug, COUNT(i.id) as imgs, SUM(i.is_cover) as covers
  FROM products p
  LEFT JOIN product_images i ON i.product_id = p.id
  WHERE p.deleted = 0
  GROUP BY p.id
  ORDER BY p.slug
`).all();
console.table(rows);
