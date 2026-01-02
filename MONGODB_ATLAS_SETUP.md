# MongoDB Atlas Setup for Vercel

## Common Issues Causing 500 Errors

Even with environment variables set correctly in Vercel, you might still get 500 errors if MongoDB Atlas is not configured properly.

### 1. IP Whitelist Configuration (MOST COMMON ISSUE)

**Problem:** MongoDB Atlas blocks all IP addresses by default. Vercel uses dynamic IPs, so you need to allow all IPs.

**Solution:**
1. Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com)
2. Select your cluster
3. Click **Network Access** in the left sidebar
4. Click **Add IP Address**
5. Click **Allow Access from Anywhere** (or enter `0.0.0.0/0`)
6. Click **Confirm**

**Important:** This allows connections from any IP. For production, consider using Vercel's static IPs if available, but `0.0.0.0/0` is fine for most use cases.

### 2. Database User Permissions

**Check:**
1. Go to **Database Access** in MongoDB Atlas
2. Verify your database user has proper permissions
3. User should have at least **Read and write to any database** or specific database access

### 3. Connection String Format

Your connection string should look like:
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

**Verify:**
- Username and password are correct
- Database name is correct (you're using `cognivex`)
- No extra spaces or characters

### 4. Vercel Redeployment Required

**After setting environment variables in Vercel:**
1. You MUST redeploy for changes to take effect
2. Go to Vercel Dashboard → Your Project → Deployments
3. Click the three dots (⋯) on the latest deployment
4. Click **Redeploy**
5. Or push a new commit to trigger automatic redeploy

### 5. Testing Your Setup

After redeploying, test these endpoints:

1. **Health Check:**
   ```
   https://your-project.vercel.app/api/health-check
   ```
   This will show:
   - Environment variables status
   - MongoDB connection test
   - Specific error messages if any

2. **MongoDB Test:**
   ```
   https://your-project.vercel.app/api/admin/mongodb-test
   ```
   This will test the MongoDB connection directly

3. **Simple Test:**
   ```
   https://your-project.vercel.app/api/test-setup
   ```
   This checks if environment variables are accessible

### 6. Check Vercel Function Logs

If still getting errors:
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on a deployment
3. Click **View Function Logs**
4. Look for MongoDB connection errors
5. Common errors:
   - `ENOTFOUND` - DNS resolution failed
   - `EAUTH` - Authentication failed
   - `ETIMEDOUT` - Connection timeout (usually IP whitelist issue)
   - `MongoServerError` - Server-side error

### 7. Your Current Configuration

Based on your setup:
- **MONGODB_URI:** ✅ Set correctly
- **JWT_SECRET:** ✅ Set correctly
- **Database:** `cognivex`
- **Cluster:** `cluster0.fgigxod.mongodb.net`

**Next Steps:**
1. ✅ Verify IP whitelist allows `0.0.0.0/0`
2. ✅ Redeploy on Vercel
3. ✅ Test `/api/health-check` endpoint
4. ✅ Check Vercel function logs for specific errors

### Quick Checklist

- [ ] MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- [ ] Database user has proper permissions
- [ ] Connection string is correct in Vercel
- [ ] Redeployed after setting environment variables
- [ ] Tested `/api/health-check` endpoint
- [ ] Checked Vercel function logs for errors

