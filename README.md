# John Remy Gonzales — Portfolio

Personal portfolio for John Remy Gonzales, a full-stack web developer and BSIT
student. The single-page site presents an about section, tech stack, featured
projects, certifications, and contact links, and generates a downloadable
resume as a PDF.

## Stack

- **Framework:** Create React App (react-scripts 5) + React 19, plain JavaScript
- **Styling:** Tailwind CSS 3 (PostCSS)
- **Animation:** framer-motion — respects `prefers-reduced-motion`
- **Resume export:** jsPDF (generated client-side)

## Getting started

Node.js 18 or newer is recommended.

```bash
npm install     # install dependencies
npm start       # start the dev server at http://localhost:3000
```

## Scripts

| Command            | Description                                                |
| ------------------ | ---------------------------------------------------------- |
| `npm start`        | Run the dev server with hot reload at `localhost:3000`.    |
| `npm run build`    | Build the production bundle to `build/`.                   |
| `npm test`         | Run the test suite (Jest + Testing Library) in watch mode. |
| `CI=true npm test` | Run the tests once, non-interactively.                     |

There is no separate lint script; ESLint runs through react-scripts during
`start` and `build`.

## Project structure

| Path                                | Purpose                                                |
| ----------------------------------- | ------------------------------------------------------ |
| `src/App.js`                        | Full single-page portfolio UI and resume PDF generator.|
| `src/elegant/`                      | Shared design-system helpers (button styles, icons).   |
| `src/index.css`, `tailwind.config.js` | Tailwind setup and theme tokens.                     |
| `public/`                           | Static assets and the HTML/manifest shell.             |
