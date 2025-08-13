# Registration Form Production Troubleshooting Guide

This document provides guidance on fixing issues with the event registration form in production.

## Common Issues and Solutions

### 1. Registration Form Not Opening in Production

**Symptoms:**
- Registration form works on localhost but doesn't open when clicking the "Register" button in production

**Fixes:**
- We've updated the code to use relative URLs (`/api/events/register`) instead of absolute URLs with base paths
- This ensures the API calls work correctly regardless of the deployment environment

### 2. Environment Variable Configuration

**Required Environment Variables:**
- Make sure these environment variables are set in your Vercel dashboard:
  ```
  NEXT_PUBLIC_APP_URL=https://your-production-domain.com
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
  CLERK_SECRET_KEY=your_clerk_secret
  DATABASE_URL=your_database_url
  RESEND_API_KEY=your_resend_key
  ```

**Verifying Variables:**
- To check if variables are set correctly, you can add a temporary debug route

### 3. BigInt Serialization Issues

**Symptoms:**
- Error: "Do not know how to serialize a BigInt"

**Fix:**
- We've updated the API routes to convert BigInt values to strings before sending them in the response
- This fixes JSON serialization issues with the `registrationNumber` field

### 4. Cross-Origin Issues

**Symptoms:**
- CORS errors in the browser console
- API requests failing in production but working locally

**Fixes:**
- Use relative paths for API requests
- For third-party API requests, make sure you've configured CORS properly

### 5. Authentication Issues

**Symptoms:**
- "Unauthorized" errors when accessing protected routes in production

**Fixes:**
- Make sure Clerk is properly configured
- Check that the authentication middleware is working correctly
- Verify that cookies are being properly set and sent with requests

## Deployment Process

1. **Pre-Deployment Checks:**
   - Run `npm run build` locally to catch any build-time errors
   - Make sure all API routes return properly serialized JSON
   - Verify that relative URLs are used for all internal API calls

2. **Vercel Deployment:**
   - Push changes to your GitHub repository
   - Vercel will automatically deploy the changes
   - Check the build logs for any errors

3. **Post-Deployment Verification:**
   - Test the registration process end-to-end
   - Check that emails are being sent correctly
   - Verify that registrations are being stored in the database

## Quick Fixes

If the registration form still doesn't work in production:

1. Try clearing your browser cache
2. Verify that JavaScript is enabled
3. Check the browser console for any errors
4. Make sure your database is accessible from the Vercel deployment
5. Check that Clerk authentication is working properly
