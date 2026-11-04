# PinkSurfing Landing

Standalone Next.js product hub for **pinksurfing.com** — routes visitors to App, Shop, and Vendors.

## Products linked

| Product | URL |
|---------|-----|
| App | https://app.pinksurfing.com |
| Shop | https://shop.pinksurfing.com |
| Vendors | https://vendors.pinksurfing.com |
| Google Play | https://play.google.com/store/apps/details?id=com.pinksurfing.com |

Vendor payouts are stated as **US only**.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production

```bash
npm run build
npm start
```

Point the apex domain `pinksurfing.com` (and optionally `www`) at this app’s host. Shop traffic should live on `shop.pinksurfing.com`.

## Stack

- Next.js 15 (App Router)
- Tailwind CSS 4
- Framer Motion (scroll + hero motion; respects `prefers-reduced-motion`)
- Plus Jakarta Sans
- PinkSurfing brand tokens (`#0e0f13` / `#9747ff`)
