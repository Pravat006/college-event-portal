# College Event Portal - Complete Documentation

![College Event Portal](https://img.shields.io/badge/College_Event_Portal-v0.1.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-6.13.0-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![Clerk](https://img.shields.io/badge/Clerk-Authentication-purple)
![Resend](https://img.shields.io/badge/Resend-Email-orange)

## Table of Contents

1. [Project Overview](#project-overview)
2. [Working Methodology](#working-methodology)
3. [Technical Architecture](#technical-architecture)
4. [Features & Functionality](#features--functionality)
5. [Database Schema](#database-schema)
6. [API Reference](#api-reference)
7. [Authentication System](#authentication-system)
8. [Email Notification System](#email-notification-system)
9. [Frontend Architecture](#frontend-architecture)
10. [Deployment Guidelines](#deployment-guidelines)
11. [Environment Variables](#environment-variables)
12. [Development Guidelines](#development-guidelines)
13. [Project Structure](#project-structure)
14. [Troubleshooting](#troubleshooting)
15. [Future Enhancements](#future-enhancements)

## Project Overview

The College Event Portal is a comprehensive web application designed to streamline event management in educational institutions. This platform enables college administrators to create and manage events, while allowing students to discover, register for, and receive notifications about campus activities.

The system features role-based access control, with separate interfaces for regular users and administrators. It integrates secure authentication, real-time notifications, email alerts, and comprehensive analytics to provide a complete event management solution.

### Core Objectives

- Simplify event discovery and registration for students
- Provide administrators with tools to manage events and analyze participation
- Automate notification processes for event updates and registrations
- Create a responsive, accessible interface that works across all devices
- Ensure data security and privacy for all users

## Working Methodology

The College Event Portal was developed using a combination of modern software development methodologies and practices, ensuring high-quality code, efficient collaboration, and timely delivery.

### Development Approach

#### Agile Methodology
- **Sprint Planning**: Two-week development sprints with clear objectives and deliverables
- **Daily Stand-ups**: Brief meetings to discuss progress and blockers
- **Sprint Reviews**: Demonstrations of completed features at the end of each sprint
- **Retrospectives**: Regular reflection on process improvements

#### Feature-Driven Development
- Each feature is developed in isolation with a focus on completing end-to-end functionality
- Features pass through stages: planning, design, development, testing, and deployment
- Feature branches in Git that merge into the main branch upon completion

### Code Quality Practices

#### Test-Driven Development (TDD)
- Writing tests before implementing features
- Focus on achieving high test coverage for critical components
- Integration tests for API endpoints and user flows

#### Code Reviews
- All code changes undergo peer review before merging
- Emphasis on code readability, performance, and adherence to project standards
- Automated quality checks using ESLint and TypeScript

### DevOps Practices

#### Continuous Integration (CI)
- Automated test runs on every pull request
- Linting and type checking to catch errors early
- Build verification to ensure deployment readiness

#### Continuous Deployment (CD)
- Automated deployments to staging environment for feature validation
- Production deployments triggered manually after testing in staging
- Roll-back capability for failed deployments

### Project Management

#### Issue Tracking
- All tasks and bugs tracked in GitHub Issues
- Clear issue templates for feature requests, bug reports, and improvements
- Prioritization based on business value and technical dependencies

#### Documentation
- In-code documentation for functions and components
- Comprehensive project documentation (this document)
- API documentation using comments and OpenAPI specification

### Collaboration Model

#### Pair Programming
- Complex features developed using pair programming
- Knowledge sharing and mentoring between team members
- Real-time problem solving and design discussions

#### Cross-Functional Teams
- Development team includes frontend, backend, and design expertise
- Regular collaboration with stakeholders for feedback and validation
- User testing sessions with actual college students and administrators

## Technical Architecture

### Technology Stack

#### Frontend
- **Framework**: Next.js 15.4.6
- **UI Library**: React 19.1.0
- **Styling**: Tailwind CSS 4.x
- **Animation**: Framer Motion 12.23.12
- **Form Management**: React Hook Form 7.62.0
- **Form Validation**: Zod 4.0.15
- **Date Handling**: date-fns 4.1.0
- **Notifications**: Sonner 2.0.7 / React Hot Toast 2.5.2
- **Icons**: Lucide React 0.537.0
- **Component Library**: Custom UI with Radix UI primitives

#### Backend
- **Server Framework**: Next.js API Routes
- **Database ORM**: Prisma 6.13.0 with Prisma Accelerate extension
- **Authentication**: Clerk 6.29.0
- **Email Service**: Resend 6.0.0
- **Data Fetching**: TanStack React Query 5.84.2
- **Webhook Handling**: Svix 1.71.0

#### Database
- **Type**: PostgreSQL
- **Access**: Direct via Prisma ORM
- **Schema Management**: Prisma Migrations

#### DevOps
- **Deployment Platform**: Vercel
- **Version Control**: Git
- **Linting**: ESLint 9.x
- **Type Checking**: TypeScript 5.x

## Features & Functionality

### For Students/Users
1. **Account Management**
   - Sign up and sign in with email/password or social logins
   - Profile management
   - Dashboard to view registered events

2. **Event Discovery**
   - Browse upcoming events with filtering options
   - View event details including time, location, capacity, and description
   - See event status (upcoming, in progress, completed, cancelled)

3. **Event Registration**
   - Register for events with student information collection
   - Cancel registrations for upcoming events
   - Receive confirmation emails upon registration
   - Get notifications for event updates or cancellations

### For Administrators
1. **Event Management**
   - Create, edit, publish, unpublish, and cancel events
   - Set event capacity, location, and time
   - View list of registered students
   - Send updates to registered participants

2. **User Management**
   - View all users in the system
   - Assign or revoke admin privileges
   - Monitor user activity

3. **Analytics Dashboard**
   - Track event attendance and registration metrics
   - Analyze popular event categories
   - Monitor user engagement

## Database Schema

The database is structured around several core entities:

### User
- Managed by Clerk, with core user data stored in Clerk's database
- Custom user metadata synced to local database for relationships

### Event
- Contains event details including title, description, date/time, location
- Tracks capacity, registration count, and event status
- References creator (admin user)

### Registration
- Links users to events they've registered for
- Includes status (registered, attended, cancelled)
- Stores registration time and student-specific information
- Uses BigInt for registration numbers to handle large college IDs

### Notification
- Stores system notifications for users
- Tracks read/unread status
- Links to relevant events or actions

## API Reference

The application exposes several API endpoints:

### Authentication
- `/api/auth/check-user` - Verifies user authentication status
- Various Clerk-managed endpoints for sign-in, sign-up, and session management

### Events
- `GET /api/events` - List all events with filtering options
- `POST /api/events` - Create a new event (admin only)
- `PUT /api/events/:id` - Update event details (admin only)
- `DELETE /api/events/:id` - Cancel or delete an event (admin only)

### Registrations
- `POST /api/events/register` - Register for an event
- `GET /api/events/register` - Get user's registered events
- `DELETE /api/events/register` - Cancel event registration

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id` - Mark notification as read

### Admin
- `GET /api/admin/analytics` - Get site-wide analytics (admin only)
- `GET /api/admin/users` - List all users (admin only)

## Authentication System

The application uses Clerk for authentication, which provides:

- Email/password authentication
- Social login integration (Google, GitHub, etc.)
- Session management
- User profile handling
- Role-based access control

The middleware.ts file handles route protection, ensuring that:
- Public routes are accessible to everyone
- Dashboard routes require authentication
- Admin routes require both authentication and admin role

The authentication flow uses Next.js middleware for route protection and API route handlers validate authentication for all data operations.

## Email Notification System

The email system uses Resend.com as the delivery provider:

### Implementation Details:
- Email templates are defined in `/src/components/emails/`
- Email sending logic is in `/src/lib/email.ts`
- HTML-based templates with inline CSS for maximum compatibility

### Email Types:
1. **Event Registration Confirmation**
   - Sent when a user successfully registers for an event
   - Includes event details, date, time, and location
   - Provides instructions for the event

2. **Event Update Notification**
   - Sent when an event's details are changed
   - Highlights the updated information

3. **Event Cancellation Alert**
   - Sent when an event is cancelled
   - Includes reason for cancellation if provided

### Email Configuration:
- Uses Resend API key stored in environment variables
- Sender address configured as "College Events <events@resend.dev>"
- For production, should use a verified custom domain

## Frontend Architecture

The frontend follows a component-based architecture using Next.js App Router:

### Page Structure
- Public landing page with event highlights
- Authentication pages (handled by Clerk)
- User dashboard with event listings and registrations
- Admin dashboard with enhanced management features

### Component Organization
- `/src/components/ui/` - Base UI components (buttons, inputs, etc.)
- `/src/components/` - Feature-specific components
- `/src/app/` - Next.js routes and page components

### State Management
- React Query for server state
- React Context for global UI state
- Form state managed with React Hook Form

### Styling Approach
- Tailwind CSS for styling
- Class Variance Authority for component variants
- Mobile-first responsive design

## Deployment Guidelines

The application is configured for deployment on Vercel:

### Deployment Process
1. Push code to a GitHub repository
2. Connect the repository to Vercel
3. Configure environment variables
4. Deploy!

### Production Requirements
- PostgreSQL database instance
- Clerk account with production API keys
- Resend account with verified domain
- Environment variables properly configured

### Build Process
The build process is defined in package.json:
```json
"build": "prisma generate && next build"
```

This ensures that Prisma client is generated before the Next.js build process.

## Environment Variables

The following environment variables are required:

### Authentication (Clerk)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key
- `CLERK_SECRET_KEY` - Clerk secret key
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL` - Sign-in route path
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL` - Sign-up route path
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` - Redirect path after sign-in
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` - Redirect path after sign-up

### Database
- `DATABASE_URL` - PostgreSQL connection string with Prisma Accelerate

### Email
- `RESEND_API_KEY` - Resend API key for email delivery

### Webhooks
- `CLERK_WEBHOOK_SECRET` - Secret for Clerk webhooks

## Development Guidelines

### Setting Up Development Environment
1. Clone the repository
2. Install dependencies with `npm install`
3. Copy `.env.example` to `.env` and fill in environment variables
4. Run database migrations with `npx prisma migrate dev`
5. Start development server with `npm run dev`

### Database Management
- Generate Prisma client: `npx prisma generate`
- Create migration: `npx prisma migrate dev --name <migration-name>`
- Reset database: `npx prisma migrate reset --force`
- Seed database: `npm run prisma:seed`

### Coding Standards
- TypeScript for type safety
- ESLint for code quality
- Consistent component structure
- Proper error handling
- Comprehensive test coverage

## Project Structure

```
college-event-portal/
├── prisma/                 # Database schema and migrations
│   ├── schema.prisma       # Prisma schema definition
│   └── migrations/         # Database migrations
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js app router pages
│   │   ├── (auth)/         # Authentication routes
│   │   ├── (dashboard)/    # User dashboard routes
│   │   ├── admin/          # Admin routes
│   │   └── api/            # API routes
│   ├── components/         # React components
│   │   ├── ui/             # Base UI components
│   │   └── emails/         # Email templates
│   ├── lib/                # Utility functions
│   │   ├── auth.ts         # Authentication utilities
│   │   ├── email.ts        # Email sending functions
│   │   └── prisma.ts       # Prisma client instance
│   ├── hooks/              # Custom React hooks
│   └── types/              # TypeScript type definitions
├── .env                    # Environment variables
├── package.json            # Project dependencies
└── next.config.js          # Next.js configuration
```

## Troubleshooting

### Common Issues

#### Email Delivery Problems
- Verify Resend API key is correctly set in environment variables
- Check sender domain verification status in Resend dashboard
- Look for error messages in console logs or server logs

#### Database Connection Issues
- Verify DATABASE_URL is correctly set
- Check network connectivity to database server
- Ensure Prisma migrations are applied

#### Authentication Problems
- Verify Clerk API keys are correct
- Check Clerk dashboard for user session errors
- Ensure redirect URLs are properly configured

## Future Enhancements

1. **Mobile Application**
   - Develop companion mobile app using React Native

2. **Advanced Analytics**
   - Implement detailed reporting on event attendance
   - Add user engagement metrics

3. **Event Check-in System**
   - QR code-based attendance tracking
   - On-site registration capabilities

4. **Integration Capabilities**
   - Calendar sync with Google/Outlook
   - Social media sharing

5. **Enhanced Communication**
   - In-app messaging between event organizers and attendees
   - Push notifications for mobile users

---

## Summary

The College Event Portal is a modern, full-stack web application built with Next.js, React, and Prisma, providing a comprehensive solution for managing college events. It features user authentication via Clerk, a PostgreSQL database for data storage, and Resend for email notifications.

The application offers role-based access with separate interfaces for students and administrators, enabling event discovery, registration, and management. The frontend is built with React and styled with Tailwind CSS, while the backend leverages Next.js API routes and Prisma ORM for database operations.

This documentation covers the technical architecture, features, API endpoints, database schema, and deployment guidelines, providing a complete reference for developers working on the project.
