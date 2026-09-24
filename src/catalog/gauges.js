/** Garg gauge chart. Do not substitute a generic SWG table. */
const GAUGE_CHART = [
  ['26 g', '0.40 mm'],
  ['24 g', '0.50 mm'],
  ['22 g', '0.60 mm'],
  ['20 g', '0.80 mm'],
  ['19 g', '1 mm'],
  ['18 g', '1.2 mm'],
  ['16 g', '1.5 mm'],
  ['14 g', '2 mm'],
  ['12 g', '2.5 mm'],
  ['10 g', '3 mm'],
  ['8 g', '4 mm'],
  ['6 g', '5 mm']
];

function gaugeTable() {
  return [['Gauge', 'Size'], ...GAUGE_CHART];
}

module.exports = { GAUGE_CHART, gaugeTable };
