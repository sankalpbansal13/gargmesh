// Lightweight markdown-ish renderer for blog post bodies.
// Supports: ## h2, ### h3, > blockquote, - bullet lists, | tables (with |---| separator), **bold**, plain paragraphs.
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function inline(s) {
  return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}
function splitRow(r) {
  return r.replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
}
function renderBody(lines) {
  let html = '';
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line == null) { i++; continue; }
    if (String(line).trim() === '') { i++; continue; }
    const L = String(line);
    if (L.startsWith('### ')) { html += '<h3 class="post-h3">' + inline(L.slice(4)) + '</h3>'; i++; continue; }
    if (L.startsWith('## ')) { html += '<h2 class="post-h2">' + inline(L.slice(3)) + '</h2>'; i++; continue; }
    if (L.startsWith('> ')) {
      const buf = [];
      while (i < lines.length && String(lines[i]).startsWith('> ')) { buf.push(String(lines[i]).slice(2)); i++; }
      html += '<blockquote class="post-bq">' + inline(buf.join(' ')) + '</blockquote>';
      continue;
    }
    if (L.startsWith('- ')) {
      const items = [];
      while (i < lines.length && String(lines[i]).startsWith('- ')) { items.push(String(lines[i]).slice(2)); i++; }
      html += '<ul class="post-ul">';
      items.forEach(it => { html += '<li>' + inline(it) + '</li>'; });
      html += '</ul>';
      continue;
    }
    if (L.startsWith('|')) {
      const rows = [];
      while (i < lines.length && String(lines[i]).startsWith('|')) { rows.push(String(lines[i])); i++; }
      if (rows.length >= 2 && /^\|[\s:|-]+\|?$/.test(rows[1])) {
        const heads = splitRow(rows[0]);
        html += '<div class="table-wrap"><table class="cmp-table"><thead><tr>';
        heads.forEach(h => { html += '<th>' + inline(h) + '</th>'; });
        html += '</tr></thead><tbody>';
        for (let r = 2; r < rows.length; r++) {
          const cells = splitRow(rows[r]);
          html += '<tr>';
          // pad to header count
          for (let c = 0; c < heads.length; c++) { html += '<td>' + inline(cells[c] || '') + '</td>'; }
          html += '</tr>';
        }
        html += '</tbody></table></div>';
      } else {
        rows.forEach(r => { html += '<p>' + inline(r) + '</p>'; });
      }
      continue;
    }
    html += '<p>' + inline(L) + '</p>';
    i++;
  }
  return html;
}
module.exports = { renderBody, inline };
