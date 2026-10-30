# CodeAlpha Full Stack Web Development Internship

Submission by **Imtiaz Ali**

This repository has all three tasks I built during the CodeAlpha Full Stack Web Development internship.

## Why this repository exists

CodeAlpha asks for all tasks in one repository.

I built each task in its own repository first, and I did not know about this rule at that time. After I learned it, I created this repository and moved all three projects here.

The full commit history of each project is in its original repository. Links are in the table below, so you can check how each project was built step by step.

## Projects

| Task | Project | What it is | Main tech | Folder in this repo | Original repo (with full commit history) |
|:---:|:---|:---|:---|:---|:---|
| 1 | Dukaan | E-commerce store | Vue 3, Vite, Express, MongoDB, Tailwind CSS | [CodeAlpha_Dukaan](./CodeAlpha_Dukaan) | [Open](https://github.com/imtiazaly/CodeAlpha_Dukaan) |
| 2 | Mansooba | Project management tool | React, TypeScript, Express, PostgreSQL, Prisma, Socket.io | [CodeAlpha_Mansooba](./CodeAlpha_Mansooba) | [Open](https://github.com/imtiazaly/CodeAlpha_Mansooba) |
| 3 | Miloo | Social media app | React, TypeScript, Express, MySQL, Sequelize, Tailwind CSS | [CodeAlpha_Miloo](./CodeAlpha_Miloo) | [Open](https://github.com/imtiazaly/CodeAlpha_Miloo) |

---

## Task 1: Dukaan (E-commerce Store)

![Dukaan preview](CodeAlpha_Dukaan/client/public/dashboard.PNG)

Dukaan is an online store where a user can browse products, add them to a cart, and place an order.

**Tech stack**
- Frontend: Vue 3, Vite, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Auth: JWT, passwords hashed with bcrypt

**What it does**
- Product list with search, category filter, and price sorting
- Cart drawer with live total
- Checkout with cash on delivery and a test payment option
- Orders use a database transaction, so stock is reduced safely and a product is not sold more than its stock
- Order tracking with status: Pending, Processing, Shipped, Delivered
- Cancelling an order puts the stock back
- Seed script that adds more than 200 products
- Demo login on the login page: `demo@user.com` / `12345678`

---

## Task 2: Mansooba (Project Management Tool)

![Mansooba preview](CodeAlpha_Mansooba/client/public/preview.PNG)

Mansooba (منصوبہ means "plan") is a tool where teams can make workspaces, projects, and tasks, and work together.

**Tech stack**
- Frontend: React, TypeScript, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL with Prisma
- Real time: Socket.io
- Auth: JWT, bcrypt

**What it does**
- Many workspaces for one user, with an easy switch between them
- Roles in a workspace, and the owner of a workspace cannot be removed or demoted by other admins
- Invitation flow: a person must accept or decline an invite before joining
- Real time updates with Socket.io, so team members see changes without refreshing the page
- Dark theme interface

---

## Task 3: Miloo (Social Media App)

![Miloo preview](CodeAlpha_Miloo/client/public/preview.PNG)

Miloo is a social media app where users can post, follow other users, like, and comment.

**Tech stack**
- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express, Multer
- Database: MySQL with Sequelize
- Auth and validation: JWT, bcrypt, Yup

**What it does**
- Two feeds: one for all posts and one for posts from people you follow
- Infinite scroll in the feed
- Create posts with text, image upload or image URL, and hashtags
- Search users while typing, with recent search history
- Like and unlike, comments (create, edit, delete), follow and unfollow, and bookmarks

---

## What I used across the three projects

| Area | Tools |
|:---|:---|
| Frontend | Vue 3, React, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Databases | MongoDB, PostgreSQL, MySQL |
| ORMs | Mongoose, Prisma, Sequelize |
| Real time | Socket.io |
| Security | JWT, bcrypt, input validation |

## Repository structure

```text
CodeAlpha_tasks/
├── CodeAlpha_Dukaan/      # Task 1
│   ├── client/
│   └── server/
├── CodeAlpha_Mansooba/    # Task 2
│   ├── client/
│   └── server/
├── CodeAlpha_Miloo/       # Task 3
│   ├── client/
│   └── server/
└── README.md
```

Each project has its own README with more details.

## How to run the projects

Each project has a `client` and a `server` folder. Run the server and the client in two separate terminals.

### Dukaan

```bash
# Server
cd CodeAlpha_Dukaan/server
npm install
cp .env.example .env      # set PORT and MONGO_URI
node database/seed.js     # adds the products
npm run dev

# Client
cd CodeAlpha_Dukaan/client
npm install
npm run dev
```

Open http://localhost:5173 and use the demo login: `demo@user.com` / `12345678`

### Mansooba

```bash
# Server
cd CodeAlpha_Mansooba/server
npm install
cp .env.example .env      # set DATABASE_URL and JWT_SECRET
npx prisma db push        # creates the tables
npm run dev

# Client
cd CodeAlpha_Mansooba/client
npm install
npm run dev
```

Open http://localhost:5173

### Miloo

```bash
# Server
cd CodeAlpha_Miloo/server
npm install
cp .env.example .env      # set the MySQL connection
npx tsx src/seed.ts       # adds sample users, posts, and comments
npm run dev

# Client
cd CodeAlpha_Miloo/client
npm install
npm run dev
```

Open http://localhost:5173

## About me

| | |
|:---|:---|
| Name | Imtiaz Ali |
| Internship | CodeAlpha, Full Stack Web Development |
| GitHub | [@imtiazaly](https://github.com/imtiazaly) |
| This repository | [CodeAlpha_tasks](https://github.com/imtiazaly/CodeAlpha_tasks) |

Thank you for reviewing my work. I worked hard on these three projects and I learned a lot from each one. I would be happy to get your feedback.
