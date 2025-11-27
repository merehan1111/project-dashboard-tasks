# Project Dashboard Task

Next.js + TypeScript implementation of the assessment:

- JWT-style login (mock) with roles: Admin, ProjectManager, Developer
- Role-based protected routes
- Dashboard with projects table:
  - Pagination, sorting, advanced filtering, search
  - Inline editing for status and budget
  - React Query with optimistic updates and skeleton loaders
- Project details page:
  - Project summary
  - Task list with add/edit and bulk status update
  - Auto-refresh via polling to simulate real-time updates
- react-hook-form + Zod validation
- Fully responsive Tailwind UI

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000

Use any email + password + select a role to log in (mock auth).
