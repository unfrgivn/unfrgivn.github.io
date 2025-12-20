# AGENTS.md

## Build & Run
- `npm run dev` - Start dev server (localhost:4321)
- `npm run build` - Production build
- `astro check` - TypeScript type checking (no tests configured)

## Stack
Astro 5 + React 19 + Tailwind 4 + TypeScript (strict) + MDX

## Code Style
- **Imports**: ES modules, named imports grouped (external first, then internal)
- **Types**: Explicit interfaces for props (e.g., `interface ProjectCardProps`), use Zod for content schemas
- **Formatting**: 2-space indent, single quotes, no semicolons enforcement (be consistent with file)
- **React**: Function components with `export default`, use `clsx` for conditional classes
- **Styling**: Tailwind utility classes, custom colors in `tailwind.config.mjs` (Catppuccin Macchiato theme)
- **Files**: `.astro` for pages/layouts, `.tsx` for interactive React components, `.mdx` for content

## Project Structure
- `src/pages/` - Routes (Astro file-based routing)
- `src/components/react/` - React components
- `src/content/projects/` - MDX project content (schema in `src/content/config.ts`)
- `src/styles/global.css` - Global CSS with Tailwind + CSS variables
