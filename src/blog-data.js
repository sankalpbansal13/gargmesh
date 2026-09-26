// Blog post aggregator. Each post lives in its own file under src/blog/ for maintainability.
const posts = [
  require('./blog/p01'),
  require('./blog/p02'),
  require('./blog/p03'),
  require('./blog/p04'),
  require('./blog/p05'),
  require('./blog/p06'),
  require('./blog/p07'),
  require('./blog/p08'),
  require('./blog/p09'),
  require('./blog/p10'),
  require('./blog/p11'),
  require('./blog/p12'),
  require('./blog/p13'),
  require('./blog/p14'),
  require('./blog/p15'),
  require('./blog/p16'),
  require('./blog/p17'),
  require('./blog/p18'),
  require('./blog/p19'),
  require('./blog/p20'),
  require('./blog/p21'),
  require('./blog/p22'),
  require('./blog/p23'),
  require('./blog/p24'),
  require('./blog/p25'),
  require('./blog/p26'),
  require('./blog/p27'),
  require('./blog/p28'),
  require('./blog/p29'),
  require('./blog/p30'),
  require('./blog/p31'),
  require('./blog/p32'),
  require('./blog/p33'),
  require('./blog/p34'),
  require('./blog/p35'),
  require('./blog/p36'),
  require('./blog/p37'),
  require('./blog/p38'),
  require('./blog/p39'),
  require('./blog/p40'),
  require('./blog/p41'),
  require('./blog/p42'),
  require('./blog/p43'),
  require('./blog/p44'),
  require('./blog/p45')
];

function findBySlug(slug) {
  return posts.find(p => p.slug === slug);
}

module.exports = { posts, findBySlug };
