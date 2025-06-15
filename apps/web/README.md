# Best of JS Next.js 14 application

## Technology

- [Next.js](https://nextjs.org/) with app router and React Server Components
- [shadcn/ui](https://ui.shadcn.com/) UI components, built on top of headless [Radix](https://radix-ui.com/)
- [TailwindCSS](https://tailwindcss.com/) for styling

## Development

Requirements:

- Node.js 20
- [PNPM](https://pnpm.io/) 10

The app is part of a monorepo built using [PNPM workspace](https://pnpm.io/workspaces) feature.

Install dependencies at the monorepo root level:

```bash
pnpm install
```

Switch to the application folder

```bash
cd apps/bestofjs-nextjs
```

### Build and simulate production in local

```bash
pnpm build
pnpm start
```

#### Note about commands in the workspace

Commands can be launched at the root level using the `-F` (filter) parameter, followed by the package name.
For example:

```bash
pnpm -F bestofjs-nextjs dev
```

#### Development mode with automatic reloads

First, we need to build a JSON file that will be queried by the backend:

```bash
pnpm build-project-data
```

```bash
pnpm dev
```

## Testing

### Unit Testing

```bash
pnpm test
```

### e2e

#### 1. Install Playwright Dependencies

```bash
pnpm test:e2e:install
```

#### 2. Run E2E Tests

e2e can be run on next production or dev server

> [!WARNING]
> The dev server may cause tests to timeout.
> So using the production server is recommended.

#### 2.a Production server

Playwright will automatically start the production server so just make sure to create a next build

```bash
cd apps/bestofjs-nextjs/
pnpm build && pnpm test:e2e
```

#### 2.b Dev server

Use two terminals with the following commands

Terminal 1:

```bash
pnpm dev
```

Terminal 2:

```bash
pnpm test:e2e
```

## Analyzing app bundles

#### 1. Run bundle-analyzer

```bash
cd apps/bestofjs-nextjs/
pnpm analyze
```

#### 2. Inspect the app bundles

- Via the terminal

- Via the browser

> If the pages are not loaded automatically, open them manually.

```bash
cd ./next/analyze/
```

Open the following files in the browser:

`client.html` - displays all the bundles for the client side.

`nodejs.html` - displays all the bundles for the server side.
