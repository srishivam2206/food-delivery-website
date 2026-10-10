# Foodie - Food Delivery Website

A full-stack food ordering web app. Users can browse a menu, search and filter dishes, add items to a cart, create an account, place an order and see their order history.

Built with the MERN stack: **M**ongoDB, **E**xpress, **R**eact and **N**ode.js.

## Features

- Sign up and log in (passwords are hashed with bcrypt, sessions use JWT tokens)
- Menu with live search and category filters
- Cart with quantity controls (kept after a page refresh)
- Checkout with delivery address and payment method
- Order history for the logged-in user
- The server calculates the order total from database prices, so the browser cannot change what you pay

## Tech stack

| Part | Technology |
| --- | --- |
| Frontend | React 18, React Router, Vite, plain CSS |
| Backend | Node.js, Express |
| Database | MongoDB with Mongoose |
| Auth | JSON Web Tokens (JWT), bcryptjs |

## Project structure

```
food-delivery-website/
├── client/                 React app
│   └── src/
│       ├── api.js          Helper for calling the backend
│       ├── context/        Login state and cart state
│       ├── components/     Navbar, MenuCard
│       └── pages/          Menu, Cart, Login, Orders
└── server/                 Express API
    └── src/
        ├── app.js          Express app and routes
        ├── index.js        Starts the server
        ├── seed.js         Fills the database with sample dishes
        ├── models/         User, MenuItem, Order
        ├── middleware/     Login check (JWT)
        └── routes/         auth, menu, orders
```

## How to run it on your computer

You need [Node.js](https://nodejs.org) 18 or newer and MongoDB (either installed locally or a free [MongoDB Atlas](https://www.mongodb.com/atlas) database).

### 1. Start the backend

```bash
cd server
npm install
cp .env.example .env      # on Windows: copy .env.example .env
```

Open `.env` and set:

- `MONGO_URI` to your MongoDB connection string
- `JWT_SECRET` to any long random text

Then add the sample menu and start the server:

```bash
npm run seed
npm run dev
```

The API runs on http://localhost:5000. Check http://localhost:5000/api/health, it should show `{"status":"ok"}`.

### 2. Start the frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## API endpoints

| Method | Endpoint | Login needed | What it does |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | No | Create an account |
| POST | `/api/auth/login` | No | Log in and get a token |
| GET | `/api/auth/me` | Yes | Check the current user |
| GET | `/api/menu?q=&category=` | No | List dishes, with optional search and category |
| GET | `/api/menu/categories` | No | List categories |
| POST | `/api/orders` | Yes | Place an order |
| GET | `/api/orders` | Yes | List your own orders |

## Limitations

- **Payments are not real.** "Online payment" is a demo option only. No money is charged and no payment gateway is connected.
- **No admin panel.** Dishes are added through `server/src/seed.js`, not through the website.
- **Order status does not change automatically.** Every order stays at "placed" because there is no restaurant or delivery side.
- **No automated tests yet.**
- **The token is stored in `localStorage`.** That is fine for a learning project, but a production app would usually use httpOnly cookies.

## Ideas to extend it

- Add an admin page to create and edit dishes
- Connect a real payment gateway such as Razorpay in test mode
- Add automated tests for the API routes
- Deploy the frontend to Vercel and the backend to Render
