# Best of JS Next.js 13 application

The "next" version of Best of JS is coming soon!

Available at https://beta.bestofjs.org/

## Technology

- Next.js app router with React Server Components
- [shadcn/ui](https://ui.shadcn.com/) UI components, built on top of headless [Radix](https://radix-ui.com/)
- [TailwindCSS](https://tailwindcss.com/) for styling

## Development

Requirements:

- Node.js 18
- [PNPM](https://pnpm.io/)

The app is part of a monorepo built using [PNPM workspace](https://pnpm.io/workspaces) feature.

Install dependencies at the monorepo root level:

```
pnpm install
```

Switch to the application folder

```
cd apps/bestofjs-nextjs
```

#### Build and simulate production in local

```
pnpm build
pnpm start
```

#### Development mode with automatic reloads

First, we need to build a JSON file that will be queried by the backend:

```
pnpm build-project-data
```

```
pnpm dev
```

#### Note about commands in the workspace

Commands can be launched at the root level using the `-F` (filter) parameter, followed by the package name.
For example:

```
pnpm -F bestofjs-nextjs dev
```
