
# JanConnect Setup Guide

## 🚀 Complete Setup Instructions

### 1. MongoDB Setup
```bash
# Install MongoDB locally or use MongoDB Atlas
# Update connection string in server.js if needed
```

### 2. Email Configuration (Gmail SMTP)

#### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Enable 2-Factor Authentication if not already enabled

#### Step 2: Generate App Password
1. Go to Google Account > Security > 2-Step Verification
2. Click "App passwords" at the bottom
3. Generate password for "Mail"
4. Copy the 16-character password

#### Step 3: Set Environment Variables
Create a `.env` file in your project root:

```env
# Gmail SMTP Configuration
EMAIL_USERNAME=your_gmail@gmail.com
EMAIL_PASSWORD=your_16_character_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false

# Admin Configuration
ADMIN_EMAIL=admin@janconnect.in

# MongoDB (if using remote)
MONGODB_URI=mongodb://localhost:27017/janconnect

# Supabase (optional for directory + email logs)
SUPABASE_URL=https://<your-project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### Step 4: Update Officer Database
Edit `services/departmentMapper.js` with real officer emails:

```javascript
const OFFICER_DATABASE = {
  "DJB": {
    "New Delhi": {
      name: "Real Officer Name",
      designation: "Assistant Engineer",
      email: "real.officer@delhi.gov.in", // UPDATE THIS
      phone: "+91-11-23456789",
      zone: "Zone-1 Central Delhi"
    }
  }
  // ... add more real officers
};
```

### 3. Supabase Auth (Email/Password + Google)

Set these in your frontend `.env` for the Vite app:

```env
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

In Supabase Dashboard, enable Email and Google providers. Set OAuth redirect to:

`https://localhost:5173/auth/callback` (dev) or your deployed domain `/auth/callback`.

Run the migrations in `supabase/migrations` so `public.profiles` exists and RLS allows a user to read/update their own profile.

### 4. Start the Application

#### Backend:
```bash
node server.js
```

#### Frontend:
```bash
npm run dev
```

### 5. Test Email Functionality

1. Submit a test complaint via `/report`
2. Check console logs for email status
3. Verify email delivery to officer

### 6. Department Mapping

The system automatically maps:
- **Water issues** → DJB (Delhi Jal Board)
- **Road/Traffic** → PWD (Public Works Department)  
- **Garbage/Sanitation** → MCD (Municipal Corporation of Delhi)
- **Others** → MCD (default)

### 7. Complaint Flow

1. User submits complaint → `/api/issues`
2. System determines department via AI mapping
3. Looks up assigned officer for area + department
4. Sends professional email to officer
5. Logs email status in MongoDB
6. Updates complaint timeline
7. User can track via "My Complaints"

### 🔧 Troubleshooting

**Email not sending?**
- Check Gmail app password is correct
- Verify 2FA is enabled on Gmail account
- Check console logs for specific errors

**Officer not found?**
- Update `OFFICER_DATABASE` in `departmentMapper.js`
- Add your constituency/area officers

**Timeline not updating?**
- Check MongoDB connection
- Verify API routes are working

### ✅ Features Completed

- ✅ Department auto-mapping (Water→DJB, Roads→PWD, etc.)
- ✅ Officer lookup by area + department
- ✅ Professional email notifications with HTML templates
- ✅ Email status logging in MongoDB
- ✅ Visual complaint timeline (6 stages)
- ✅ Real-time complaint tracking
- ✅ Responsive UI with status badges
- ✅ File attachment support
- ✅ Search and filter complaints

Your JanConnect app is now fully functional! 🎉
```
