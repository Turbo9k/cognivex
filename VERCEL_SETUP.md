# Vercel Deployment Setup Guide

## Environment Variables Configuration

To fix the 500 error on Vercel, you need to configure environment variables in your Vercel project dashboard.

### Required Environment Variables

1. **MONGODB_URI** (Required)
   - Your MongoDB connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`
   - Get this from MongoDB Atlas or your MongoDB provider

2. **JWT_SECRET** (Required)
   - Secret key for JWT token encryption
   - Use a strong, random string (at least 32 characters)
   - Example: `your-super-secret-jwt-key-change-this-in-production`

3. **NEXTAUTH_URL** (Optional but recommended)
   - Your Vercel deployment URL
   - Format: `https://your-project.vercel.app`

4. **NODE_ENV** (Optional)
   - Set to `production` for production deployments
   - Vercel sets this automatically, but you can override it

### How to Add Environment Variables in Vercel

1. **Go to your Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Log in and select your project

2. **Navigate to Settings**
   - Click on your project
   - Go to **Settings** tab
   - Click on **Environment Variables** in the sidebar

3. **Add Each Variable**
   - Click **Add New**
   - Enter the variable name (e.g., `MONGODB_URI`)
   - Enter the variable value
   - Select the environments where it should be available:
     - ✅ Production
     - ✅ Preview
     - ✅ Development (optional)
   - Click **Save**

4. **Redeploy Your Application**
   - After adding environment variables, you need to redeploy
   - Go to **Deployments** tab
   - Click the three dots (⋯) on the latest deployment
   - Click **Redeploy**
   - Or push a new commit to trigger a redeploy

### Quick Setup Checklist

- [ ] Add `MONGODB_URI` with your MongoDB connection string
- [ ] Add `JWT_SECRET` with a strong random string
- [ ] Add `NEXTAUTH_URL` with your Vercel URL (optional)
- [ ] Redeploy the application
- [ ] Test the API endpoints

### Testing Your Configuration

After setting up environment variables and redeploying, you can test:

1. **Check MongoDB Connection**
   - Visit: `https://your-project.vercel.app/api/admin/mongodb-test`
   - Should return connection status

2. **Test Subscription Endpoint**
   - Try subscribing via the newsletter form
   - Should no longer return 500 error

3. **Check Server Logs**
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on a deployment → View Function Logs
   - Look for any error messages

### Troubleshooting

**Still getting 500 errors?**
- Verify environment variables are set correctly (no typos)
- Check that `MONGODB_URI` is a valid connection string
- Ensure you've redeployed after adding variables
- Check Vercel function logs for specific error messages

**MongoDB Connection Issues?**
- Verify your MongoDB connection string is correct
- Check MongoDB Atlas IP whitelist (should allow all IPs: `0.0.0.0/0`)
- Ensure your MongoDB cluster is running
- Check MongoDB user permissions

**JWT Errors?**
- Make sure `JWT_SECRET` is set and not empty
- Use a strong, random secret (not the example value)

### Security Notes

- Never commit `.env` files to git (they're already in `.gitignore`)
- Use different `JWT_SECRET` values for production and development
- Rotate secrets periodically
- Use Vercel's environment variable encryption

