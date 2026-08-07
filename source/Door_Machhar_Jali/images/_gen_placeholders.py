from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

out = Path(__file__).resolve().parent
W, H = 1536, 1024


def try_font(size):
    for name in [
        r"C:\Windows\Fonts\arialbd.ttf",
        r"C:\Windows\Fonts\arial.ttf",
        r"C:\Windows\Fonts\segoeuib.ttf",
        r"C:\Windows\Fonts\segoeui.ttf",
    ]:
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            pass
    return ImageFont.load_default()


def label(draw, lines, y=40):
    f1 = try_font(42)
    f2 = try_font(28)
    box_h = 30 + len(lines) * 48
    draw.rectangle([40, y - 20, W - 40, y + box_h], fill=(10, 10, 10))
    draw.text((60, y), lines[0], fill=(255, 255, 255), font=f1)
    for i, t in enumerate(lines[1:]):
        draw.text((60, y + 50 + i * 36), t, fill=(212, 165, 116), font=f2)


def save(name, paint):
    img = Image.new("RGB", (W, H), (235, 234, 230))
    draw = ImageDraw.Draw(img)
    paint(img, draw)
    path = out / name
    img.save(path, "PNG", optimize=True)
    print("wrote", path.name)


# Logo
logo = Image.new("RGBA", (480, 160), (0, 0, 0, 0))
d = ImageDraw.Draw(logo)
d.rectangle([0, 0, 480, 160], fill=(10, 10, 10))
d.rectangle([0, 150, 480, 160], fill=(184, 115, 51))
d.text((24, 40), "GARG", fill=(255, 255, 255), font=try_font(54))
d.text((24, 100), "INDUSTRIAL MESH", fill=(212, 165, 116), font=try_font(28))
logo.save(out / "garg-logo.png")
print("wrote garg-logo.png")


def paint_hero(img, draw):
    img.paste((32, 36, 40), [0, 0, W, H])
    for x in range(80, 900, 10):
        for y in range(120, 900, 10):
            if ((x // 10) + (y // 10)) % 2 == 0:
                draw.rectangle([x, y, x + 8, y + 2], fill=(180, 185, 190))
                draw.rectangle([x, y, x + 2, y + 8], fill=(150, 155, 160))
            else:
                draw.rectangle([x, y, x + 2, y + 8], fill=(200, 205, 210))
                draw.rectangle([x, y, x + 8, y + 2], fill=(160, 165, 170))
    draw.ellipse([980, 200, 1420, 840], fill=(195, 200, 205), outline=(100, 100, 100), width=4)
    draw.ellipse([1040, 280, 1360, 760], fill=(40, 44, 48), outline=(80, 80, 80), width=2)
    draw.arc([1000, 220, 1400, 820], 200, 340, fill=(220, 180, 120), width=6)
    label(draw, ["Aluminium & SS Machhar Jali", "Woven insect screen · Not welded", "Roll widths 2 ft – 6 ft · Noida"], 50)


save("door_mesh_hero.png", paint_hero)


def paint_alu(img, draw):
    img.paste((210, 214, 218), [0, 0, W, H])
    for x in range(60, W - 60, 16):
        draw.line([(x, 80), (x, H - 80)], fill=(140, 145, 150), width=1)
    for y in range(80, H - 80, 16):
        draw.line([(60, y), (W - 60, y)], fill=(140, 145, 150), width=1)
    draw.rectangle([60, 80, W - 60, H - 80], outline=(80, 80, 80), width=3)
    label(draw, ["Aluminium Machhar Jali", "14×14 / 16×16 / 18×16 · Lightweight roll"], 50)


save("door_mesh_alu_roll.png", paint_alu)


def paint_ss(img, draw):
    img.paste((45, 50, 55), [0, 0, W, H])
    for x in range(60, W - 60, 12):
        draw.line([(x, 80), (x, H - 80)], fill=(190, 195, 200), width=1)
    for y in range(80, H - 80, 12):
        draw.line([(60, y), (W - 60, y)], fill=(190, 195, 200), width=1)
    draw.rectangle([60, 80, W - 60, H - 80], outline=(212, 165, 116), width=3)
    label(draw, ["SS 304 / SS 202 Mosquito Mesh", "Woven stainless · Premium & value grades"], 50)


save("door_mesh_ss_roll.png", paint_ss)


def paint_weave(img, draw):
    img.paste((250, 249, 246), [0, 0, W, H])
    s = 28
    for i, x in enumerate(range(100, W - 100, s)):
        for j, y in enumerate(range(100, H - 100, s)):
            draw.line([(x - 10, y), (x + 10, y)], fill=(90, 90, 95), width=3)
            draw.line([(x, y - 10), (x, y + 10)], fill=(110, 110, 115), width=3)
            if (i + j) % 2 == 0:
                draw.ellipse([x - 3, y - 3, x + 3, y + 3], fill=(60, 60, 65))
    label(draw, ["Woven plain weave close-up", "Over/under wires — NOT welded nuggets"], 40)


save("door_mesh_weave_closeup.png", paint_weave)


def paint_widths(img, draw):
    img.paste((242, 241, 239), [0, 0, W, H])
    widths = [2, 2.5, 3, 3.5, 4, 4.5, 5, 6]
    left = 80
    for i, w in enumerate(widths):
        h = 120 + i * 70
        bar_w = int(180 + w * 140)
        draw.rectangle([left, h, left + bar_w, h + 48], fill=(30, 30, 30), outline=(184, 115, 51), width=2)
        draw.text((left + 16, h + 8), f"{w} ft roll width", fill=(255, 255, 255), font=try_font(28))
    label(draw, ["Available roll widths", "2 · 2.5 · 3 · 3.5 · 4 · 4.5 · 5 · 6 ft"], 30)


save("door_mesh_widths.png", paint_widths)


def paint_counts(img, draw):
    img.paste((20, 22, 24), [0, 0, W, H])
    specs = [("14×14", "ALU standard"), ("16×16", "Mid fine"), ("18×16", "Fine insect"), ("18×18", "SS fine")]
    for i, (m, note) in enumerate(specs):
        x0 = 80 + (i % 2) * 720
        y0 = 160 + (i // 2) * 380
        draw.rectangle([x0, y0, x0 + 640, y0 + 300], fill=(40, 44, 48), outline=(184, 115, 51), width=2)
        spacing = 22 if i < 2 else 16
        for x in range(x0 + 30, x0 + 610, spacing):
            draw.line([(x, y0 + 70), (x, y0 + 270)], fill=(180, 185, 190), width=1)
        for y in range(y0 + 70, y0 + 270, spacing):
            draw.line([(x0 + 30, y), (x0 + 610, y)], fill=(180, 185, 190), width=1)
        draw.text((x0 + 40, y0 + 20), m, fill=(255, 255, 255), font=try_font(40))
        draw.text((x0 + 200, y0 + 28), note, fill=(212, 165, 116), font=try_font(26))
    label(draw, ["Mesh counts for machhar jali", "14 / 16 / 18 — openings per inch"], 30)


save("door_mesh_counts.png", paint_counts)


def paint_304_202(img, draw):
    img.paste((236, 235, 232), [0, 0, W, H])
    draw.rectangle([80, 160, 720, 860], fill=(50, 55, 60), outline=(184, 115, 51), width=3)
    draw.rectangle([816, 160, 1456, 860], fill=(90, 95, 100), outline=(110, 110, 110), width=3)
    draw.text((120, 200), "SS 304", fill=(255, 255, 255), font=try_font(56))
    draw.text((120, 280), "Higher nickel", fill=(212, 165, 116), font=try_font(32))
    draw.text((120, 340), "Outdoor / monsoon", fill=(220, 220, 220), font=try_font(28))
    draw.text((120, 400), "Premium door mesh", fill=(220, 220, 220), font=try_font(28))
    draw.text((856, 200), "SS 202", fill=(255, 255, 255), font=try_font(56))
    draw.text((856, 280), "Economy stainless", fill=(212, 165, 116), font=try_font(32))
    draw.text((856, 340), "Milder exposure", fill=(220, 220, 220), font=try_font(28))
    draw.text((856, 400), "Value machhar jali", fill=(220, 220, 220), font=try_font(28))
    label(draw, ["SS 304 vs SS 202 — honest grade guide", "Same weave family · Different corrosion life"], 40)


save("door_mesh_304_vs_202.png", paint_304_202)


def paint_materials(img, draw):
    img.paste((245, 244, 241), [0, 0, W, H])
    cards = [
        (80, "Fiberglass", "Budget windows", (120, 140, 100)),
        (540, "Aluminium", "Inland doors", (160, 165, 170)),
        (1000, "SS 304/202", "Pets / monsoon", (70, 75, 80)),
    ]
    for x, title, note, c in cards:
        draw.rectangle([x, 200, x + 420, 820], fill=c, outline=(30, 30, 30), width=2)
        draw.text((x + 30, 260), title, fill=(255, 255, 255), font=try_font(36))
        draw.text((x + 30, 330), note, fill=(230, 230, 230), font=try_font(26))
    label(draw, ["ALU vs Fiberglass vs Stainless", "Assign material by opening — not one SKU everywhere"], 40)


save("door_mesh_alu_vs_fiber_vs_ss.png", paint_materials)


def paint_apps(name, title, subtitle, color):
    def paint(img, draw):
        img.paste(color, [0, 0, W, H])
        draw.rectangle([200, 120, 1336, 900], outline=(255, 255, 255), width=8)
        draw.rectangle([240, 160, 1296, 860], outline=(200, 200, 200), width=2)
        for x in range(260, 1280, 14):
            draw.line([(x, 180), (x, 840)], fill=(180, 185, 190), width=1)
        for y in range(180, 840, 14):
            draw.line([(260, y), (1280, y)], fill=(180, 185, 190), width=1)
        label(draw, [title, subtitle], 50)

    save(name, paint)


paint_apps("door_mesh_app_door.png", "Door frame / darwaze wali jali", "Hinged & main-door insect screens", (55, 60, 70))
paint_apps("door_mesh_app_window.png", "Window channel mesh", "3-track / spare track panels", (60, 70, 75))
paint_apps("door_mesh_app_balcony.png", "Balcony & sliding openings", "High-traffic insect screen cloth", (45, 55, 60))
paint_apps("door_mesh_app_magnetic.png", "Magnetic / DIY screen cloth", "Cut from roll for kits & DIY", (70, 65, 55))


def paint_not_welded(img, draw):
    img.paste((240, 239, 236), [0, 0, W, H])
    draw.rectangle([80, 180, 720, 860], fill=(255, 255, 255), outline=(40, 40, 40), width=3)
    draw.text((120, 220), "THIS PAGE", fill=(184, 115, 51), font=try_font(32))
    draw.text((120, 280), "Woven machhar jali", fill=(20, 20, 20), font=try_font(36))
    for x in range(140, 660, 10):
        draw.line([(x, 360), (x, 800)], fill=(120, 120, 120), width=1)
    for y in range(360, 800, 10):
        draw.line([(140, y), (660, y)], fill=(120, 120, 120), width=1)
    draw.rectangle([816, 180, 1456, 860], fill=(230, 230, 230), outline=(120, 120, 120), width=3)
    draw.text((856, 220), "NOT THIS", fill=(140, 80, 80), font=try_font(32))
    draw.text((856, 280), "Welded / chain / punch", fill=(40, 40, 40), font=try_font(32))
    for x in range(860, 1410, 60):
        for y in range(360, 800, 60):
            draw.rectangle([x, y, x + 50, y + 50], outline=(80, 80, 80), width=2)
    label(draw, ["Disambiguation", "Woven insect screen ≠ fencing weld mesh"], 40)


save("door_mesh_not_welded.png", paint_not_welded)
print("DONE", len(list(out.glob("*.png"))), "pngs")
