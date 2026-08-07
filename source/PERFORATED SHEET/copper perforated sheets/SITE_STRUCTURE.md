# GARG INDUSTRIAL MESH — Copper Perforated Sheet Buying Guide

Site shell for content agents. Brand: **GARG INDUSTRIAL MESH** only. **Copper only** (brass guide separate).

## Files

| File | Role |
|------|------|
| `css/styles.css` | Global styles — copper accent `#B87333`, sticky nav, tables, `.tip` / `.warn` callouts, responsive, print |
| `js/nav.js` | Mobile menu toggle + `aria-current="page"` on active link |
| `_nav-snippet.html` | Copy-paste header/footer/nav block |
| `index.html` | Hub — section placeholders for content agents |

## Pages (exact nav links — use on every page)

| File | Nav label | `aria-current` when active |
|------|-----------|----------------------------|
| `index.html` | Hub | yes on hub |
| `material-grades.html` | Grades | yes on grades |
| `standards.html` | Standards | yes on standards |
| `temper.html` | Temper | yes on temper |
| `thickness-guide.html` | Thickness | yes on thickness |
| `perforation-dimensions.html` | Perforation | yes on perforation |
| `blank-edge-margins.html` | Margins | yes on margins |
| `applications.html` | Applications | yes on applications |
| `how-to-order.html` | How to Order | yes on how to order |
| `glossary.html` | Glossary | yes on glossary |

Nav is set automatically by `js/nav.js`; manual `aria-current="page"` is optional.

## Footer (every page)

```html
<footer class="site-footer">
  <p><strong>GARG INDUSTRIAL MESH</strong> · Custom hole sizes, pitches, open areas &amp; orientations available on order.</p>
</footer>
```

## Content markers

Replace everything between `<!-- CONTENT START -->` and `<!-- CONTENT END -->` in each page. Do not remove header, footer, or `<script src="js/nav.js">`.

Shell-only sections on `index.html` use class `shell-section` and `content-marker` comments — replace those blocks with real content.

## CSS callouts

```html
<div class="tip">
  <span class="label">Tip</span>
  <p>…</p>
</div>

<div class="warn">
  <span class="label">Warning</span>
  <p>…</p>
</div>
```

Legacy `.callout` and `.callout.warn` also work.

## Page order (prev/next)

1. index.html
2. material-grades.html
3. standards.html
4. temper.html
5. thickness-guide.html
6. perforation-dimensions.html
7. blank-edge-margins.html
8. applications.html
9. how-to-order.html
10. glossary.html
