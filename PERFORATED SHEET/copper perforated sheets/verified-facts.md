# Verified technical facts — copper perforated sheet buying guide

Re-verified 2026-07-30 against primary / near-primary sources listed in `sources.txt`.  
Status tags: **Verified** | **Industry practice** | **Uncertainty** | **Buyer-confirm**

---

## 1. ASTM B152 / B152M scope

**Verified**

- ASTM B152/B152M is the product specification for **copper sheet, strip, plate, and rolled bar** made from listed UNS coppers (including C10100, C10200, C11000, C12200, and others such as C10300, C10800, C12000, silver-bearing tough-pitch grades, etc.).
- It sets requirements for **chemical composition**, **temper**, **mechanical properties**, and (where specified) **electrical resistivity**, plus general requirements via ASTM B248/B248M.
- It applies to the **unperforated mill product**. Punching/perforating is secondary manufacturing; mill certificates typically cover the blank, not the finished perforated panel geometry.

**Verified exclusions / limits (from standard notes)**

- Not intended for material rolled to **ounce-weight** thicknesses → ASTM B370 (building construction sheet/strip).
- Flat products with **finished (rolled or drawn) edges** (flat wire/strip) → ASTM B272.
- If the purchase order **does not name a copper UNS No.**, the supplier may furnish **any** copper listed in the specification.

**Buyer-confirm**

- Year of issue on the PO (e.g. B152/B152M-19 vs -24).
- Whether resistivity and/or hydrogen-embrittlement testing are required (ordering options in B152).
- That “ASTM B152” on a perforated sheet quote means the **base metal**, not DIN hole-pattern compliance.

---

## 2. Common UNS grades — differences that matter for perforated sheet

Values below are **annealed / soft** reference conductivity unless noted. Cold work (including perforation) lowers conductivity relative to annealed mill data.

### C11000 — ETP (electrolytic tough pitch)

**Verified (copper.org / UNS)**

| Item | Fact |
| --- | --- |
| Cu | ≥ 99.90% (incl. Ag) |
| Oxygen | Present / process-dependent; not “oxygen-free.” Typical literature range ~0.02–0.04% (200–400 ppm) as Cu₂O — **not always printed as a max on the CDA composition table** |
| Electrical conductivity | High-conductivity copper: **minimum 100% IACS** annealed; CDA physical property listing often **~101% IACS** |
| Joining (CDA suitability) | Soldering Excellent; Brazing Good; oxyacetylene welding **Not Recommended**; gas-shielded arc **Fair** |
| Process risk | Susceptible to **hydrogen embrittlement** when heated in reducing / hydrogen-bearing atmospheres (cuprous oxide + H → steam at grain boundaries). ASTM B577 is the related embrittlement-detection method family |

**Industry practice:** Default commercial / architectural / general electrical perforated copper where maximum conductivity matters and high-heat reducing joining is not planned.

### C12200 — DHP (deoxidized, high residual phosphorus)

**Verified (copper.org)**

| Item | Fact |
| --- | --- |
| Cu | ≥ 99.9% |
| Phosphorus | **0.015–0.040%** (intentional deoxidizer) |
| Electrical conductivity | CDA lists **85% IACS** at 68°F (physical property table) — materially lower than ETP/OF because residual P scatters electrons |
| Joining (CDA suitability) | Soldering Excellent; Brazing Excellent; oxyacetylene **Good**; gas-shielded arc **Excellent** |
| Process risk | Deoxidized → **not** subject to the ETP Cu₂O hydrogen-embrittlement mechanism; preferred when welding/brazing process control is uncertain |

**Buyer-confirm:** Some trade sources quote “85–90% IACS”; treat **85%** as the CDA tabulated value and confirm mill cert if a floor above 85% is required.

### C10100 — OFE (oxygen-free electronic) and C10200 — OF (oxygen-free)

**Verified (copper.org / UNS)**

| | C10100 OFE | C10200 OF |
| --- | --- | --- |
| Common names | Oxygen-free electronic | Oxygen-free (no residual deoxidants) |
| Cu min | **99.99%** (exclusive of Ag per CDA notes) | **99.95%** (incl. Ag) |
| Oxygen max | **0.0005%** | **0.0010%** |
| Conductivity | **Min 101% IACS** annealed (exception vs other high-conductivity grades at 100%) | High-conductivity class: **min 100% IACS**; CDA physical listing **101% IACS** |
| Joining | Excellent soldering/brazing; designed to **avoid hydrogen embrittlement** in braze/weld/vacuum service | Same family benefit: will not hydrogen-embrittle from Cu₂O mechanism |
| Spec extras | Often tied to ASTM F68 / electronic-device purity packages | Common “oxygen-free” commercial callout |

**Uncertainty / naming**

- **“OFHC”** is a **trade/historical term** (oxygen-free high conductivity), not a single UNS number. Buyers often mean C10200, sometimes C10100. **Write the UNS number.**
- C10100 has tighter impurity maxima (Bi, Se, Te, etc.) than C10200; do not treat them as interchangeable for vacuum/electronic duty.

**Summary comparison (annealed reference)**

| Grade | Oxygen story | Conductivity class | Weld/braze in reducing heat |
| --- | --- | --- | --- |
| C11000 ETP | Oxygen-bearing | ~100–101% IACS | Risk / process-sensitive |
| C12200 DHP | P-deoxidized | ~85% IACS (CDA) | Favoured |
| C10200 OF | O ≤ 10 ppm | ~100–101% IACS | Favoured |
| C10100 OFE | O ≤ 5 ppm + tight impurities | ≥101% IACS | Favoured |

---

## 3. Temper designations commonly used for copper sheet

**Verified — ASTM B601 classification (used by B152)**

Cold-worked (rolled) H-series, common trade names:

| ASTM code | Trade name |
| --- | --- |
| H00 | 1/8 hard |
| H01 | 1/4 hard |
| H02 | 1/2 hard |
| H03 | 3/4 hard |
| H04 | Hard |
| H06 | Extra hard |
| H08 | Spring |

Annealed O-series commonly seen on sheet:

| ASTM code | Meaning |
| --- | --- |
| O60 | Soft annealed |
| O68 | Deep-drawing anneal |
| O25 | Hot-rolled and annealed |
| OS025 / OS050 | Annealed to nominal grain size (mm) |

Also common: **M20** as-hot-rolled (manufactured temper).

**Industry practice**

- Trade language **soft / annealed**, **half-hard**, **hard** maps roughly to **O60 / H02 / H04**, but tensile/hardness windows are alloy- and thickness-specific in B152 tables — soft words alone are not a complete PO.
- Perforating **cold-works** local ligaments; as-delivered perforated temper is **not identical** to the blank temper without agreement.

**Buyer-confirm**

- Blank temper before punching.
- Whether post-punch flatten/anneal is allowed.
- Mechanical property tests on perforated product (almost never identical to blank mill cert).

---

## 4. DIN 24041 perforation naming (Rv etc.) — accuracy and copper caveats

**Verified (naming convention in European trade / DIN practice)**

Round-hole arrangement codes (DIN 24041 family):

| Code | Meaning |
| --- | --- |
| **Rv** | Round holes, **60° staggered** rows (most common “staggered”) |
| **Rd** | Round holes, **diagonally staggered** |
| **Rg** | Round holes, **straight** rows |

Square: Qv / Qd / Qg. Oblong/slot: Lv / Lg / Lge. Hexagonal: often HV / SKv depending on source edition.

**Specification form (industry):** `Rv w – t`  
Example: **Rv 5–8** = round staggered, hole width (diameter) **w = 5 mm**, pitch **t = 8 mm**.

Related symbols (DIN / perforator glossaries): **w** hole width, **t** pitch (centre-to-centre), **c** bridge (= t − w for equal round holes in the simple case), **e₁,e₂ / f₁,f₂** blank margins, **A₀** relative open surface of the **perforated field**.

**Verified scope caveats (SIS abstract of DIN 24041)**

- Document applies to rectangular plates with regularly distributed round/square/oblong holes in staggered, diagonally staggered, or straight lines — **independent of material type** for the dimensional naming system.
- **Machining/processing tolerances** in the standard are stated for **steel up to 750 MPa tensile strength** and **aluminium** — **not formally calibrated as copper tolerance tables**.

**Copper-specific caveats (industry practice — flag clearly)**

- Soft copper with wide or unequal blank margins, high open area, or unperforated bands tends toward **larger flatness / sabre deviations**; acceptable flatness should be **agreed separately** (Aherhammer / Dillinger guidance).
- Citing “DIN 24041” on a copper PO correctly means **pattern geometry naming**; it does **not** automatically import steel/aluminium tolerance or flatness guarantees for copper.
- Do not confuse DIN 24041 pattern codes with **ISO 7805**, sieve standards (DIN 4185/4187), or quality marks sometimes listed beside “ISO 24041” on fabricator sites without checking the document.

**Uncertainty:** Exact table values and tolerance numbers require the purchased DIN 24041 edition (e.g. 2021/2022 revisions). Use mill/fabricator drawings for contractual dimensions.

---

## 5. Open area formulas

**Verified — geometric open area of an infinite perforated field**

Let **D** = hole diameter, **P** (or **C** / **t**) = centre-to-centre pitch.

### Round holes, 60° staggered (hexagonal packing)

Industry standard shortcut:

\[
\mathrm{OA\%} = \frac{D^{2} \times 90.69}{P^{2}}
\]

**Also correct (exact π form):** unit cell for 60° stagger has area \(P^{2}\sqrt{3}/2\), so

\[
\mathrm{OA\%} = \frac{\pi D^{2}/4}{P^{2}\sqrt{3}/2}\times 100 = \frac{\pi}{2\sqrt{3}}\times 100 \times \frac{D^{2}}{P^{2}} \approx 90.690\times\frac{D^{2}}{P^{2}}
\]

- **OA ≈ (D² × 90.7) / P²** is an acceptable **rounded** form of the same relation.
- Some catalogues use **90.5** (e.g. Metalex) — slightly coarser; prefer **90.69** or the π form for published guide copy.

### Round holes, straight (orthogonal / 90°) centres

\[
\mathrm{OA\%} = \frac{\pi D^{2}}{4 P^{2}}\times 100 = \frac{D^{2} \times 78.54}{P^{2}}
\]

(when pitch is equal in both axes; if pitches differ, use \(P_x \times P_y\) in the denominator).

**Also verified:** Round 45° stagger uses the same **78.54** constant as straight centres in common US catalogue formulas (different geometry name, same constant in those tables).

**Caveats (must state in buying guides)**

- Formulas describe the **perforated field only**, not the whole sheet. Blank margins **reduce** overall open fraction.
- Punch taper / die break means measured hole diameter may differ slightly from punch size; OA based on **finished hole** if critical.
- Incomplete end rows (“big beginning” tooling) change edge OA locally.

---

## 6. Punching rule of thumb — hole diameter vs thickness

**Industry practice (not a copper-specific ASTM/DIN law)**

Widely cited perforator guideline for **steel, aluminium, and similar**:

- **Minimum hole diameter ≈ material thickness** (ratio **≥ 1:1**).
- **Minimum bridge (bar) ≈ material thickness** (same order of magnitude).
- Harder materials (stainless, high-strength steel) often need **larger** hole/bridge relative to thickness (sometimes ~2:1–3:1 cited for stainless).

**Copper context**

- Copper is soft and punches more readily than stainless; **1:1 remains the safe default starting rule**.
- Sub-thickness holes may be possible with suitable tooling (analogous to aluminium allowances in tooling guides) but require **prior technical clarification** — not a universal promise.

**Buyer-confirm:** Tooling available, thickness, temper, open area, and whether laser/plasma is an alternative for small holes.

---

## 7. Blank / margin practice

**Industry practice (DIN-oriented fabricator glossaries)**

- **Blank margin** = distance from sheet edge to the first row of holes (symbols **e₁, e₂, f₁, f₂**). Measured to the **outer edge of holes**, not hole centres.
- If margins are **not specified**, fabricators often apply **“smallest possible blank margin”** constrained by tooling and pattern pitch — widths can vary sheet-to-sheet.
- **Unfinished / as-produced** ends may have incomplete holes (pattern runs off the sheet). **Finished / resheared** margins give controlled solid borders after cutting.
- Sheets **without** blank margins are often nest-cut from larger perforated stock or coil-perforated with continuous pattern.
- Wide, unequal, or interrupted margins increase **distortion risk**, especially in soft copper.

**Buyer-confirm:** Exact margin widths on all four sides; whether incomplete edge holes are acceptable; flatness tolerance after perforation; feed/perforation direction if pattern orientation matters.

---

## 8. What must be buyer-confirmed vs universal truth

### Universal / guide-safe (state as fact)

| Topic | Safe statement |
| --- | --- |
| B152 scope | Covers copper sheet/strip/plate/rolled bar chemistry & temper for listed UNS grades; not ounce-weight (B370) or finished-edge flat wire (B272) |
| Grade chemistry classes | ETP oxygen-bearing; DHP phosphorus-deoxidized; OF/OFE oxygen-free with tabulated O maxima |
| Conductivity ranking (annealed) | C10100 / C10200 / C11000 ≫ C12200 for electrical conductivity |
| Temper codes | ASTM B601 H00–H04 and O60 language is standard; soft/half-hard/hard is informal |
| DIN naming | Rv = round 60° stagger; Rg = round straight; form Rv w–t |
| OA math | 60° stagger ≈ D²×90.69/P²; straight = πD²/(4P²)×100 (= D²×78.54/P²) |
| Punching rule of thumb | Start at hole ≥ thickness and bridge ≥ thickness; exceptions need fabricator OK |
| Margins | Unspecified → “smallest possible”; critical aesthetics/structure → specify |

### Buyer-confirm / not universal (do not write as absolute)

| Topic | Why |
| --- | --- |
| Exact %IACS after perforation | Cold work + geometry; certs are usually blank-based |
| That C11000 “cannot be welded” | Overstatement — CDA says Fair/Not Recommended by process, not a physical impossibility under all methods |
| Copper flatness to steel DIN tables | Soft Cu needs agreed limits |
| Hole < thickness is “always OK in copper” | Tooling- and thickness-dependent |
| Stock pattern availability | Tooling inventory varies by mill |
| “OFHC” without UNS | Ambiguous (C10100 vs C10200) |
| End use (electrical vs facade vs braze-heavy HVAC vs vacuum) | Steers grade more than appearance |
| Certification stack | Mill B152 cert ≠ perforated dimensional inspection report |
| Price / lead time / gauge range | Commercial, not metallurgical constants |

---

## 9. Quick flags for guide authors

1. Prefer **UNS numbers** over “pure copper,” “ETP,” or “OFHC” alone.  
2. Prefer **90.69** (or exact π form) over **90.5** when publishing OA formulas; **90.7** is fine if labelled approximate.  
3. State that OA formulas ignore margins.  
4. Separate **base-metal standard (ASTM B152)** from **pattern naming (DIN 24041)**.  
5. Separately call out **hydrogen embrittlement** for C11000 under reducing heat — it is the main joining differentiator vs DHP/OF/OFE, not “copper can’t be joined.”  
6. Anything about achievable thickness, margins, or flatness on copper perforated sheet is **fabricator confirmation**, not encyclopedia fact.
