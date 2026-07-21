# Treshbliky Billfits — Website

## 📁 File Structure

```
treshbliky/
├── index.html        → Homepage (hero, carousels, social links)
├── designs.html      → Designs gallery (searchable + filterable)
├── products.html     → Natives / English Wear / Agbada tabs
├── order.html        → Place Order form (full measurements + design pick)
├── invoice.html      → Order confirmation + invoice
├── about.html        → About us + Contact + Social QR codes
├── css/
│   └── style.css     → Shared styles, colors, fonts, components
├── js/
│   └── utils.js      → Shared utilities (toast, form validation, storage)
└── assets/           ← PUT YOUR IMAGES HERE
    ├── logo.png       ← Your brand logo (recommended: 200x200px, transparent BG)
    ├── qr-whatsapp.png
    ├── qr-instagram.png
    ├── qr-tiktok.png
    └── qr-snapchat.png
```

---

## 🖼️ Adding Your Logo

Every page has a logo placeholder. To add your real logo:

1. Save your logo as `assets/logo.png`
   - Recommended size: **200×200px** (square) with **transparent background**
   - Works best as PNG

2. In every HTML file, find the comment:
   ```html
   <!-- <img src="assets/logo.png" alt="Logo"/> -->
   ```
   Remove the `<!-- -->` comment marks and delete the fallback `<span>` above it.

3. Pages with logo slots:
   - **Navbar** (top left on every page)
   - **Hero section** (index.html — large logo display)
   - **Footer** (every page)
   - **Invoice header** (invoice.html)
   - **About page hero** (about.html — largest display)

---

## 📱 Adding Your Social Links & WhatsApp

Search for `XXXXXXXXXX` in every HTML file and replace with your real WhatsApp number:
```html
href="https://wa.me/234XXXXXXXXXX"
```
Example: `https://wa.me/2348012345678`

Also replace `YOURUSERNAME` with your real handles for Instagram, TikTok, Snapchat.

---

## 🖼️ Adding QR Codes (about.html)

1. Go to https://qr-code-generator.com
2. Generate a QR for each platform link
3. Save them as:
   - `assets/qr-whatsapp.png`
   - `assets/qr-instagram.png`
   - `assets/qr-tiktok.png`
   - `assets/qr-snapchat.png`
4. In `about.html`, replace each `<div class="qr-box">` with:
   ```html
   <img src="assets/qr-whatsapp.png" style="width:80px;height:80px;border-radius:8px;"/>
   ```

---

## 🔌 Backend Integration Points

All backend integration points are marked with comments like:
```js
/* ============================================================
   BACKEND INTEGRATION POINT
   Replace this with a real API call, e.g.:
     const response = await fetch('/api/orders', { ... });
   ============================================================ */
```

### Key endpoints you'll need to build:

| Endpoint | Method | Used In |
|---|---|---|
| `/api/orders` | POST | order.html — submit order |
| `/api/orders/:id` | GET | invoice.html — fetch order |
| `/api/designs` | GET | designs.html — list designs |
| `/api/products` | GET | products.html — list products |
| `/api/users` | POST | order.html — save customer info |
| `/api/uploads` | POST | order.html — fabric photo upload |

### Database tables (from your sketch):
- **Orders** — id, number, customer_id, status, created_at
- **Order_Details** — id, order_id, design_id, qty, measurements, notes, needed_by, event
- **Products** — id, name, category_id, picture, description
- **Designs** — id, name, number, category_id, picture
- **Categories** — id, name
- **Monogram_Designs** — id, name, picture, category_id
- **User_Info** — id, name, phone, whatsapp, address
- **Invoice** — id, order_id, items, total, delivery_fee, status

---

## 🎨 Colors (to stay consistent)

```css
--navy:       #0a1f44   /* primary dark */
--blue:       #5b9fff   /* accent blue  */
--blue-light: #91c0ff   /* soft blue    */
--blue-pale:  #e8f1ff   /* background   */
--bg:         #f0f6ff   /* page bg      */
```

---

## 🚀 To Deploy

1. Add your logo and social links as described above
2. Upload the entire `treshbliky/` folder to any web host:
   - **Netlify** (free, drag & drop)
   - **Vercel** (free)
   - **GitHub Pages** (free)
   - Or your own hosting
3. Wire up the backend API endpoints
4. You're live! 🎉
