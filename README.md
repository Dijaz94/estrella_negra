# Estrella Negra

Sitio web del bar **Estrella Negra** — menú digital, eventos y administración.

## Stack

- **Framework:** Nuxt 4.4.8 (`compatibilityVersion: 4`)
- **UI:** Nuxt UI v4 + Tailwind CSS v4
- **DB:** Supabase Postgres + Prisma 7.8
- **Auth:** Node crypto (HMAC) + bcryptjs
- **Validación:** Zod v4

## Setup

```bash
npm install
npx nuxt prepare
```

## Desarrollo

```bash
npx nuxt dev
```

## Producción

```bash
npx nuxt build
npx nuxt preview
```

## BD / Prisma

```bash
npx prisma migrate dev --name <nombre>
npx prisma studio
```
