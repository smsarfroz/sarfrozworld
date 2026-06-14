**SarfrozWorld** is a social media platform where you can connect and share content. Visit the live site at [sarfrozworld-ms.vercel.app/](https://sarfrozworld-ms.vercel.app/ "https://sarfrozworld-ms.vercel.app/")

**Get started in two ways:**

- Create your own personalized profile
- Or use the designated guest account to explore instantly with no sign-in required

## Technical Details

**Frontend**
- Built with React 19 and Vite
- Material UI for component library and theming
- TanStack React Query for server-state management
- React Router v7 for routing
- JWT-based authentication handling

**Backend**
- Express.js server with Node.js (ES modules)
- PostgreSQL with Prisma ORM
- JWT for token-based authentication
- Bcrypt for password hashing
- Multer for file uploads
- XSS protection with DOMPurify

**Testing**
- Jest & Supertest for backend testing
- Vitest & React Testing Library for frontend testing

**Database & Storage**
- PostgreSQL (primary database)
- Supabase for additional backend services

**Key Integrations**
- Supabase for real-time capabilities and storage
- JWT for stateless authentication

**Social Features**
- Browse global feed with sorting options (recent/popular)
- Customize profile with bio and social links.
- Follow/unfollow other users
- Search functionality to find people on the platform
- Create posts with text, images and GIF support.
- Like and comment on community posts


## API Endpoints

### Authentication

| Method | Endpoint                | Description                |
| ------ | ----------------------- | -------------------------- |
| POST   | `/signup`               | Create new user account    |
| POST   | `/login`                | Login with email/password  |
| POST   | `/logout`               | Destroy session and logout |

### Users

| Method | Endpoint                | Description                     |
| ------ | ----------------------- | ------------------------------- |
| POST   | `/users/profile`        | Get user profile by ID/username |
| POST   | `/users/profile/update` | Update user profile             |
| GET    | `/users`                | Get all users                   |
| POST   | `/users/likesState`     | Get user's liked posts array    |
| POST   | `/users/follow`         | Follow another user             |
| POST   | `/users/unfollow`       | Unfollow a user                 |

### Posts

|Method|Endpoint|Description|
|---|---|---|
|POST|`/home`|Get all posts (feed)|
|GET|`/post`|Post page (test)|
|GET|`/post/:postId`|Get single post by ID|
|POST|`/post`|Create new post|
|PUT|`/post/update`|Update existing post|
|DELETE|`/post/delete`|Delete a post|

### Comments

|Method|Endpoint|Description|
|---|---|---|
|GET|`/posts/:postId/comments`|Get all comments for a post|
|POST|`/posts/:postId/comments`|Add comment to a post|
|DELETE|`/posts/:postId/comments/:commentId`|Delete a comment|

### File Upload

|Method|Endpoint|Description|
|---|---|---|
|POST|`/uploadfile`|Upload image/file (single file, multer)|


## Installation Procedure

### Prerequisites

- Node.js (v18 or higher)
    
- PostgreSQL (v14 or higher)
    
- Google OAuth credentials (for Passport)
    
```
### Steps

bash

# 1. Clone the repository
git clone https://github.com/yourusername/sarfrozworld.git
cd sarfrozworld

# 2. Install backend dependencies
npm install

# 3. Install frontend dependencies
cd client  # or your frontend folder
npm install
cd ..

# 4. Set up environment variables
cp .env.example .env

# Edit .env with your database URL, JWT secret, Google OAuth keys

# 5. Set up database
npx prisma migrate dev --name init
npx prisma generate

# 6. Create uploads directory
mkdir -p public/data/uploads

# 7. Run development server
npm run dev  # Backend on port 5000 (default)

# 8. In another terminal, run frontend
cd client
npm run dev  # Frontend on port 5173

```

### Environment Variables (.env)

`env`
```
DATABASE_URL="postgresql://user:password@localhost:5432/sarfrozworld"
SESSION_SECRET="your-secret-key"
JWT_SECRET="your-jwt-secret"
PORT=5000
NODE_ENV=development
```

## Contact

- GitHub: [@smsarfroz](https://github.com/smsarfroz)
- LinkedIn: [linkedin.com/in/sarfroz-sheikh](https://www.linkedin.com/in/sarfroz-sheikh/)
- Email: [ssarfroz@gmail.com](mailto:ssarfroz@gmail.com)

