# College Event Portal

A modern web application for managing college events, registrations, and event tracking, built with Next.js, React, and Prisma.

## Features

- **User Authentication**: Secure login and registration via Clerk
- **Event Management**: Create, edit, and cancel college events
- **Registration System**: Register for events and manage your registrations
- **Admin Dashboard**: Comprehensive analytics and user management
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Email Notifications**: Get updates on event changes and registrations

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: Clerk
- **Email**: Resend
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/college-event-portal.git
   cd college-event-portal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your environment variables

4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `/src/app` - Next.js application routes
- `/src/components` - Reusable React components
- `/src/lib` - Utility functions and services
- `/prisma` - Database schema and migrations
