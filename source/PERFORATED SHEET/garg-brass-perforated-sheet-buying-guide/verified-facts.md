# Verified technical facts — brass perforated sheet buying guide

Status tags: **Verified** | **Industry practice** | **Uncertainty** | **Buyer-confirm**

---

## 1. ASTM B36 / B36M scope

**Verified**

- ASTM B36/B36M is the common product specification for **brass plate, sheet, strip, and rolled bar** from listed UNS brass alloys (including cartridge brass C26000, yellow brass grades such as C27000, Muntz metal C28000, red brass C23000, and other compositions in the standard’s tables).
- It sets requirements for **chemical composition**, **temper**, and **mechanical properties** for the **unperforated mill product**.
- Punching/perforating is secondary manufacturing; mill certificates typically cover the blank, not finished hole geometry.

**Difference from copper**

- Copper sheet for perforation is commonly called out to **ASTM B152 / B152M**.
- Do **not** cite B152 as the primary product standard for brass sheet. Write **ASTM B36** + UNS for brass blanks.

**Buyer-confirm**

- Year of issue on the PO.
- That “ASTM B36” on a perforated sheet quote means the **base metal**, not DIN hole-pattern compliance.

---

## 2. Common UNS brass grades for sheet

Nominal compositions below follow common UNS / CDA descriptions. Exact limits live on the mill cert and the ordered B36 edition.

### C26000 — Cartridge brass (~70/30)

**Verified (industry / UNS practice)**

| Item | Fact |
| --- | --- |
| Approx. composition | ~70% Cu / ~30% Zn |
| Colour | Bright yellow-gold |
| Cold formability | Excellent — classic deep-drawing / cold-working brass |
| Typical use | Default commercial perforated brass for decorative screens, elevators, furniture, speaker grilles, signage |

**Industry practice:** Default cartridge brass blank for most architectural / decorative perforated sheet jobs.

### C27000 — Yellow brass (~65/35)

**Verified (industry / UNS practice)**

| Item | Fact |
| --- | --- |
| Approx. composition | ~65% Cu / ~35% Zn |
| Colour | Yellow brass family |
| Use | General-purpose yellow brass sheet when named on the drawing |

**Buyer-confirm:** Mill availability at thickness; colour match vs C26000 sample if critical.

### C28000 — Muntz metal (~60/40)

**Verified (industry / UNS practice)**

| Item | Fact |
| --- | --- |
| Approx. composition | ~60% Cu / ~40% Zn |
| Colour | Golden / warmer yellow |
| Use | Architectural accents; some marine decorative callouts when Muntz is named |

**Buyer-confirm:** Cold-form limits after perforation vs cartridge brass for tight wraps.

### C23000 — Red brass (~85/15)

**Verified (industry / UNS practice)**

| Item | Fact |
| --- | --- |
| Approx. composition | ~85% Cu / ~15% Zn |
| Colour | Reddish / copper-leaning |
| Use | Warmer red brass perforated panels; heritage / hardware faces |

**Do not** treat red brass and yellow brass as colour-interchangeable without sample approval.

### Conductivity note

**Verified class difference:** Brass electrical conductivity is **far below** pure copper (ETP ~100% IACS). Brass perforated sheet is **not** the primary material for Faraday / EMI shielding where copper conductivity is required.

---

## 3. Temper designations for brass sheet

**Verified — ASTM B601 classification (used with B36)**

Common trade mapping:

| ASTM code | Trade name |
| --- | --- |
| O60 | Annealed / soft |
| H01 | 1/4 hard |
| H02 | 1/2 hard |
| H04 | Hard |

**Industry practice**

- Soft / annealed ≈ O60; half-hard ≈ H02; hard ≈ H04 — confirm against B36 property tables for alloy + thickness.
- Perforating cold-works local ligaments; as-delivered perforated temper ≠ blank temper without agreement.

---

## 4. Open area formulas (same geometry as copper)

**Verified — geometric open area of an infinite perforated field**

### Round holes, 60° staggered

\[
\mathrm{OA\%} = \frac{D^{2} \times 90.69}{P^{2}}
\]

### Round holes, straight (90°)

\[
\mathrm{OA\%} = \frac{D^{2} \times 78.54}{P^{2}}
\]

### Square 90°

\[
\mathrm{OA\%} \approx 100 \times (w / P)^{2}
\]

Formulas describe the **perforated field only**; blank margins reduce overall open fraction.

---

## 5. Punching rule of thumb

**Industry practice**

- Minimum hole diameter ≈ material thickness (≥ 1:1).
- Minimum bridge ≈ material thickness.
- Brass punches more readily than stainless; **1:1 remains the safe default**.
- Sub-thickness holes require prior technical clarification.

---

## 6. Blank / margin practice

**Industry practice**

- Blank margin = distance from sheet edge to first hole row (outer edge of holes).
- GARG custom range: **0–100 mm**; beyond 100 mm on request.
- Unspecified margins → “smallest possible” constrained by tooling — specify if aesthetics/structure matter.

---

## 7. Density (weight estimates)

**Industry practice**

- Solid brass density typically ~**8.4–8.5 g/cm³** (alloy-dependent; cartridge brass often cited ~8.53 g/cm³).
- Perforated weight ≈ solid × (1 − OA%/100) over the field + solid blank edges.

---

## 8. Corrosion / finish

**Industry practice**

- Brass tarnishes; fingerprints show on fresh mill finish.
- High-zinc alloys can be more susceptible to **dezincification** in aggressive waters — flag wet/marine exposure and finish plan.
- Lacquer / oil / accepted patina belong on the RFQ for architectural and elevator duty.

---

## 9. What must be buyer-confirmed

| Topic | Why |
| --- | --- |
| Exact colour match lot-to-lot | Mill heat variation; approve sample |
| Flatness after high-OA perforation | Soft brass needs agreed limits |
| Hole &lt; thickness | Tooling-dependent |
| Stock pattern availability | Tooling inventory varies |
| EMI / Faraday performance | Use copper; brass is not the conductivity play |
| Certification stack | Mill B36 cert ≠ perforated dimensional report |

---

## 10. Quick flags for guide authors

1. Prefer **UNS numbers** over “yellow brass” or “cartridge” alone when colour is contractual.  
2. Prefer **ASTM B36** for brass sheet blanks — not B152.  
3. Prefer **90.69** / **78.54** OA constants; state formulas ignore margins.  
4. Separate **base-metal standard (B36)** from **pattern naming (DIN 24041)**.  
5. Keep applications brass-specific (decorative, elevator, grille, furniture) — not copper EMI as primary.
