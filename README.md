# Life Lessons Frontend

## Overview
The **Life Lessons** frontend is a modern web application designed for creating, organizing, sharing, and exploring meaningful life lessons and personal growth insights. It provides an intuitive interface for both free and premium users, as well as an admin control panel for content and user management.

## Server Repository
[https://github.com/sabilulbari/Life-lesson-server](https://github.com/sabilulbari/Life-lesson-server)
## Tech Stack
- **Next.js** (App Router)
- **React** 19
- **Tailwind CSS** & Vanilla CSS
- **Better Auth** – authentication integration (Google OAuth + Email/Password)
- **Recharts** – analytics and user dashboard data visualization
- **Lucide React** – icon system
- **Stripe Elements** – secure client-side payment processing

## Key Features
- **Dashboard & Library** – personalized dashboard for managing personal lessons, public lessons, and favorites.
- **Lesson Management** – rich editor for creating, editing, and categorizing lessons with public/private visibility and free/premium access tiers.
- **Export & Sharing** – export lessons to PDF format and share directly on social platforms.
- **Admin Console** – user management, content moderation, analytics dashboard, and flagged item inspection.
- **Responsive & Dark Mode UI** – clean, modern UI optimized for desktop, tablet, and mobile devices.

## Getting Started

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment variables**
   Create a `.env.local` file in the root of the `frontend` directory:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

4. **Build for production**
   ```bash
   npm run build
   npm run start
   ```

## Project Structure
```text
frontend/
├── src/
│   ├── app/                 # Next.js App Router routes & pages
│   │   ├── dashboard/       # User and Admin dashboards
│   │   ├── lessons/         # Public and detailed lesson views
│   │   ├── pricing/         # Premium upgrade and checkout pages
│   │   └── globals.css      # Global styles and theme definitions
│   ├── components/          # Reusable UI components (modals, cards, navbar)
│   └── lib/                 # Utility functions, API clients, auth setup
├── public/                  # Static assets and images
├── tailwind.config.js       # Tailwind CSS configuration
└── package.json
```

## Contributing
1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git checkout push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
MIT © Life Lessons Team
