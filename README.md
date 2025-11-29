#  Project Dashboard — React / Next.js (Assessment Task)

A modern, real-time project dashboard built using **Next.js**, **TypeScript**, **TailwindCSS**, **Redux Toolkit**, and **React Query**.  
This project was developed as part of a **Senior Frontend Developer Assessment Task** and includes dynamic filtering, inline editing, role-based access, and real-time updates.

---

##  Tech Stack

- **Next.js (App Router)**
- **React 18**
- **TypeScript**
- **TailwindCSS**
- **ShadCN UI**
- **Redux Toolkit**
- **React Query (TanStack Query)**
- **Framer Motion**
- **Mock API (local simulation)**
- **Optional: PWA-ready structure**

---

##  Features

###  Authentication & Role-Based Access
- JWT-style mock login  
- Roles: **Admin, Project Manager, Developer**  
- Route protection using a custom `RequireAuth` wrapper  
- Role-based UI visibility  

###  Dashboard
- KPIs (Total Projects, In-Progress, Completed)
- Animated UI + modern gradient components
- Instant project list preview

###  Project Management
- Paginated project table
- Sorting by name, start date, end date, budget
- Filtering by status & priority
- Search by project name
- Inline editing (status, budget)
- Optimistic UI updates using React Query
- Real-time updates (`refetchInterval`)

###  Project Details Page
- Dynamic route `/projects/[id]`
- Tasks list (mocked)
- Ability to add, edit, bulk update (extendable)

###  Advanced Filtering
- Search, status filter, priority filter
- Reset filters automatically on change

###  UI & UX Quality
- Fully responsive design  
- Animated login screen (Framer Motion)  
- Accessible form inputs  
- Skeleton loaders  
- Clean sidebar layout  
- Modern professional theme  

---

##  Folder Structure

```
/src
 ├── app
 │    ├── login/
 │    ├── dashboard/
 │    ├── projects/[id]/
 │    └── layout.tsx
 ├── components
 │    ├── auth/
 │    ├── layout/
 │    ├── projects/
 │    └── ui/
 ├── lib/
 │    └── mockApi.ts
 ├── redux/
 │    ├── slices/
 │    └── store.ts
 ├── types/
 └── styles/
```

---

## Installation & Setup

### 1️⃣ Clone the repo

```bash
git clone https://github.com/merehan1111/project-dashboard-tasks.git
cd project-dashboard-tasks
```

###  Install dependencies

```bash
npm install


###  Run the development server

```bash
npm run dev


The project will start at:


http://localhost:3000
```



##  Test Login Credentials (Mock)

Use any email + password, but **role must be selected**:


Email:   anything@example.com
Pass:    any 4+ chars
Role:    Admin / ProjectManager / Developer




##  Mock API

All data is simulated locally using:
`src/lib/mockApi.ts`

Features include:

- Paginated data
- Filtering
- Sorting
- Inline update patch
- Simulated latency
- Real-time polling



##  Scripts


npm run dev     → Start development
npm run build   → Production build
npm run start   → Run production server



##  Deployment (Vercel)

This project is fully compatible with **Vercel**:

1. Push to GitHub  
2. Import repo into Vercel  
3. Framework: **Next.js**  
4. Build Command:


npm run build

5. Output Directory:


.next


Deployment is instant.


##  Notes

- This is a professional assessment-style implementation.  
- UI design follows modern dashboard patterns.  
- Code is fully typed using TypeScript.  
- Supports easy extension with real backend APIs.  


## Author

**Developed by:** *Merehan*  
GitHub: https://github.com/merehan1111/project-dashboard-tasks  
Vercel Demo: https://vercel.com/merehan1111s-projects/project-dashboard-tasks


## Final Result

A clean, modern, fully responsive project dashboard built using best practices and advanced frontend patterns.

