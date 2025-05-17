# Recipe Management System

A full-stack web application for managing and sharing recipes, built with React (frontend) and Node.js/Express (backend).

## Features

- User authentication and authorization
- Create, read, update, and delete recipes
- Upload recipe images
- Favorite recipes
- Recipe categorization and filtering
- Responsive design

## Tech Stack

### Frontend
- React
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express
- MongoDB
- JWT Authentication
- Multer (file uploads)

## Project Structure

```
├── fe/                 # Frontend React application
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── services/
│   │   └── ...
│   └── package.json
│
└── be/                 # Backend Node.js/Express application
    ├── src/
    │   ├── controllers/
    │   ├── middleware/
    │   ├── models/
    │   ├── routes/
    │   └── ...
    └── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd be
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd fe
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with:
   ```
   VITE_BASE_URL=http://localhost:3000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user

### Recipes
- GET `/api/recipes` - Get all recipes
- GET `/api/recipes/:id` - Get a specific recipe
- POST `/api/recipes` - Create a new recipe
- PUT `/api/recipes/:id` - Update a recipe
- DELETE `/api/recipes/:id` - Delete a recipe

### Favorites
- POST `/api/favorites/toggle/:recipeId` - Toggle favorite status
- GET `/api/favorites` - Get user's favorite recipes
- GET `/api/favorites/check/:recipeId` - Check if recipe is favorited

## License

MIT 