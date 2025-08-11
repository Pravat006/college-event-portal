# College Event Portal Maintenance and Deployment Guide

## Environment Variables

### Required Environment Variables
The following environment variables are required for the application to function properly:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk public key for authentication
- `CLERK_SECRET_KEY`: Clerk secret key
- `DATABASE_URL`: PostgreSQL database connection string
- `RESEND_API_KEY`: API key for email service
- `CLERK_WEBHOOK_SECRET`: Secret for Clerk webhooks

### Setting Up Environment Variables
- For local development, create a `.env` file based on `.env.example`
- For production, set these in your Vercel dashboard

## Deployment Checklist

- [ ] Configure environment variables in Vercel
- [ ] Run database migrations
- [ ] Run build with `npm run build` to test
- [ ] Deploy to Vercel

## Common Issues

### Prisma Client Generation
If you're facing issues with Prisma client generation on Vercel, make sure:
- The build command includes `prisma generate`
- The postinstall script is properly set

### Database Connection
If database connection fails:
- Check your DATABASE_URL is correctly set
- Ensure your database is accessible from Vercel's deployment region
- Check if your database has reached connection limits

## Administration

### Adding Admin Users
To promote a user to admin:
1. Connect to the database
2. Update the user's role to 'ADMIN':
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

### Database Backups
It's recommended to set up regular database backups to prevent data loss.

## Performance Monitoring

Monitor the application's performance using Vercel Analytics.

## Security Notes

- Never commit `.env` files to the repository
- Regularly rotate API keys and secrets
- Keep dependencies updated to patch security vulnerabilities
