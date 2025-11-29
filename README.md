# 🏃 Morsli Sport Shop - E-commerce Platform

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) e-commerce application for Morsli Sport Shop.

## 🚀 Features

- **Product Management**: Browse products with categories, filters, and search
- **Admin Panel**: Full CRUD operations for products and orders
- **Order System**: Customer order placement with delivery options
- **Responsive Design**: Fully responsive admin panel and storefront
- **Image Storage**: Cloudinary integration for product images
- **Authentication**: JWT-based admin authentication

## 📋 Tech Stack

### Backend
- Node.js + Express.js
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary for image storage
- Multer for file uploads

### Frontend
- React.js
- Material-UI (MUI)
- Redux Toolkit Query
- React Router DOM
- Swiper.js for image sliders

## 🛠️ Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB
- Cloudinary account (for image storage)

### Backend Setup

1. **Navigate to Backend folder:**
   ```bash
   cd Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```env
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   FRONTEND_URL=your-frontend-url
   CLOUDINARY_NAME=your-cloudinary-name
   CLOUDINARY_KEY=your-cloudinary-key
   CLOUDINARY_SECRET=your-cloudinary-secret
   ```

4. **Create admin user:**
   ```bash
   node scripts/createAdmin.js
   ```

5. **Start server:**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Navigate to Frontend folder:**
   ```bash
   cd Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
e-commerce/
├── Backend/
│   ├── src/
│   │   ├── config/          # Database, Cloudinary config
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth, error handling
│   │   └── index.js         # Server entry point
│   ├── scripts/
│   │   └── createAdmin.js   # Admin user creation script
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── api/             # API service layer
│   │   ├── components/      # React components
│   │   ├── context/         # React context providers
│   │   ├── Redux/           # Redux store and slices
│   │   └── main.jsx         # App entry point
│   └── package.json
│
└── README.md
```

## 🔐 Admin Access

**Email:** `morslisport97@gmail.com`  
**Password:** `MorsliSport99@T`

Use these credentials to access the admin panel at `/admin/login`.

## 📡 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Orders
- `POST /api/orders` - Create order (Public)
- `GET /api/orders` - Get all orders (Admin only)
- `GET /api/orders/:id` - Get single order (Admin only)
- `PUT /api/orders/:id/status` - Update order status (Admin only)
- `DELETE /api/orders/:id` - Delete order (Admin only)

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current admin (Protected)
- `POST /api/auth/logout` - Logout (Protected)

## 🌐 Deployment

### Backend Deployment

1. Set environment variables in your hosting platform
2. Set start command: `npm start`
3. Ensure MongoDB connection is allowed from hosting IP

### Frontend Deployment

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your static hosting
3. Configure environment variable: `VITE_API_BASE_URL` with your backend URL
4. Ensure SPA routing is configured (all routes → index.html)

## 📝 Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRE` - JWT expiration time
- `FRONTEND_URL` - Frontend URL for CORS
- `CLOUDINARY_NAME` - Cloudinary cloud name
- `CLOUDINARY_KEY` - Cloudinary API key
- `CLOUDINARY_SECRET` - Cloudinary API secret

### Frontend (.env)
- `VITE_API_BASE_URL` - Backend API base URL

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Input validation

## 📄 License

ISC

## 👨‍💻 Author

Morsli Sport Shop

