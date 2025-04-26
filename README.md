# Matt Millard Photography Website

## Description

This is my personal photography business website

## Tech stack

- **Framework**: React w/Remix
- **Language**: Typescript
- **Styling**: Tailwind CSS
- **UI Components**: Custom + Radix + Shadcn
- **Deployment**: Cloudflare Pages
- **Database**: Cloudflare D1
- **Email**: Cloudflare Email routing + MailJet
- **File host**: Cloudflare Images
- **Spambot protection**: Cloudflare Turnstile + Honeypots
- **Form validation**: Zod + Conform

## Fonts

- **Untitled Sans**: [Klim Type Foundry](https://klim.co.nz/retail-fonts/untitled-sans)

## Development

Run the dev server:

```sh
npm run dev
```

To run Wrangler:

```sh
npm run build
npm run start
```

## Typegen

Generate types for your Cloudflare bindings in `wrangler.toml`:

```sh
npm run typegen
```

You will need to rerun typegen whenever you make changes to `wrangler.toml`.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then, deploy your app to Cloudflare Pages:

```sh
npm run deploy
```
