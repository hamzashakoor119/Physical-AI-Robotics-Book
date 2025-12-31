# Neon Postgres Setup Guide
**Phase 1: Database Configuration for Hackathon I**

## Quick Setup (5 minutes)

### Step 1: Create Neon Account
1. Go to https://neon.tech
2. Click "Sign Up" (free tier available)
3. Sign up with GitHub, Google, or email

### Step 2: Create Database
1. After login, click **"Create Project"**
2. Project settings:
   - **Project name**: `physical-ai-book`
   - **Region**: Choose closest to you (e.g., US East for USA)
   - **Postgres version**: 16 (default)
3. Click **"Create Project"**

### Step 3: Get Connection String
1. After project creation, you'll see **"Connection Details"**
2. Look for **"Connection string"** section
3. Copy the string that looks like:
   ```
   postgres://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. **Important**: This string contains your password - keep it secure!

### Step 4: Update Backend Configuration
1. Open `backend/.env` file
2. Find the line:
   ```env
   DATABASE_URL=postgres://your-user:your-password@...
   ```
3. Replace it with your Neon connection string:
   ```env
   DATABASE_URL=postgres://alex:AbC123xyz@ep-cool-voice-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### Step 5: Initialize Database
```bash
cd backend
python init_database.py
```

You should see:
```
✅ Connected to Postgres: ep-cool-voice-123456.us-east-2.aws.neon.tech/neondb
✅ Tables created successfully!
✅ Database connection verified!
```

---

## Verification Checklist

- [ ] Neon project created
- [ ] Connection string copied
- [ ] `backend/.env` updated with DATABASE_URL
- [ ] `init_database.py` executed successfully
- [ ] Tables created (users, etc.)

---

## Troubleshooting

### Error: "could not connect to server"
**Cause**: Firewall or incorrect connection string

**Fix**:
1. Verify connection string is correct
2. Check if you're behind a corporate firewall
3. Try from different network (mobile hotspot)

### Error: "psycopg2 not installed"
**Cause**: Missing Postgres driver

**Fix**:
```bash
pip install psycopg2-binary
# or
pip install -r requirements.txt
```

### Error: "SSL connection required"
**Cause**: Missing `?sslmode=require` in connection string

**Fix**: Add `?sslmode=require` to end of DATABASE_URL:
```env
DATABASE_URL=postgres://user:pass@host/db?sslmode=require
```

### Neon Project Suspended
**Cause**: Free tier has activity limits

**Fix**:
1. Go to Neon dashboard
2. Click "Resume Project"
3. For production, consider upgrading plan

---

## Security Best Practices

### ✅ DO:
- Keep `.env` file in `.gitignore` (already done)
- Use environment variables in deployment platforms
- Rotate database password periodically
- Use different credentials for dev/prod

### ❌ DON'T:
- Commit `.env` file to git
- Share connection string in public channels
- Use same password for multiple projects
- Hardcode credentials in source code

---

## Neon Free Tier Limits
- **Compute**: 300 hours/month (free)
- **Storage**: 3 GB
- **Projects**: Unlimited
- **Databases**: Unlimited per project
- **Autosuspend**: After 5 minutes of inactivity

**Tip**: For Hackathon demo, this is more than enough!

---

## Next Steps

After database setup:
1. ✅ Phase 1 Complete - Database configured
2. 🔄 Phase 2 - Add UI components (PersonalizeButton, TranslateButton)
3. 🔄 Phase 3 - Deployment verification
4. 🔄 Phase 4 - Demo video creation

---

## Alternative: Railway Postgres

If you prefer Railway (also free tier):

1. Go to https://railway.app
2. Create new project
3. Add Postgres service
4. Copy `DATABASE_URL` from variables tab
5. Update `backend/.env`

Both Neon and Railway work identically for this project.

---

**Questions?** Check backend/README.md or the audit report (HACKATHON_REQUIREMENTS_STATUS.md)
