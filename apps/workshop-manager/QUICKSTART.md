# Quick Start Guide - Workshop Manager

Get the Workshop Manager running in 5 minutes!

## ⚡ Prerequisites

- Node.js 18+ installed
- Supabase account (free at supabase.com)
- Git (already have this repo)

## 🚀 Step 1: Setup Supabase (2 minutes)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for project initialization (usually 1-2 minutes)
3. Go to **Settings → API** and copy:
   - Project URL (under "Project URL")
   - `anon` public key (under "Project API keys")
   - Service role key (under "Project API keys")

## 🔧 Step 2: Configure Environment (1 minute)

Create `.env.local` in `apps/workshop-manager/`:

```bash
cd apps/workshop-manager
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
EOF
```

Replace with your actual values from Supabase.

## 📊 Step 3: Initialize Database (1 minute)

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy-paste contents of `lib/supabase/schema.sql`
4. Click **Run**

Tables will be created automatically. ✅

## 💻 Step 4: Start Development Server (1 minute)

```bash
npm install
npm run dev
```

Access the app at **http://localhost:3000**

## 🧪 Step 5: Test the App (2 minutes)

### Test Login
- Signup with any email and password (min 6 chars)
- Verify you're redirected to dashboard

### Create a Workshop
1. Go to **/workshops** (or click "Ateliers" in sidebar)
2. Click **"+ Créer un atelier"**
3. Fill in name, date, price (e.g., 49€)
4. Click **Créer**

### Add an Attendee
1. Go to **/attendees** with workshop selected
2. Click **"+ Ajouter inscrit"**
3. Fill in name, email, select ticket type
4. Set payment to "Payé" and amount to 49€
5. Click **Ajouter**

### Check Dashboard
1. Go back to **/dashboard**
2. Select your workshop
3. Verify KPIs show:
   - ✅ 1 attendee
   - ✅ Revenue 49€
   - ✅ 1 paid

### Try All Modules
- **Tasks**: Create task, move through kanban board
- **Email**: Create campaign, transition to scheduled
- **Social**: Create LinkedIn post, schedule it
- **Budget**: Add expense, verify P&L
- **Testimonials**: Add feedback, check rating distribution
- **Outreach**: Add prospect contact, track status

## 🎯 What Works

✅ Complete CRUD on all modules  
✅ Real revenue calculation  
✅ Task status transitions  
✅ Campaign scheduling  
✅ Social media calendar  
✅ Budget P&L  
✅ Testimonial ratings  
✅ Outreach tracking  

## ⚠️ Common Issues

**"Port 3000 already in use?"**
```bash
npm run dev -- -p 3001
```

**"Supabase API key not found?"**
- Check `.env.local` is in correct folder (apps/workshop-manager/)
- Restart dev server after creating .env.local

**"Can't find module '@/supabase/client'?"**
- Run `npm install` again
- Check tsconfig.json paths configuration

**"Database error when adding attendee?"**
- Verify all schema was migrated to Supabase
- Check RLS policies are enabled

**"Login not working?"**
- Verify Supabase URL and keys are correct
- Check auth is enabled in Supabase Settings

## 📱 Test Responsive Design

```bash
# Open DevTools (F12) → Toggle device toolbar (Ctrl+Shift+M)
# Test on iPhone, iPad, Desktop
```

Should work on all screen sizes!

## 🚀 Deploy to Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "feat: MVP complete and tested"
git push
```

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **Import Project**
3. Select your GitHub repo
4. Choose **apps/workshop-manager** as root
5. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
6. Click **Deploy**

### 3. Access Live App
- Vercel gives you a URL like `https://workshop-manager-xyz.vercel.app`
- It's live! 🎉

## 📚 Next Steps

1. **Test thoroughly** on local machine
2. **Create sample data** (workshops, attendees, etc.)
3. **Deploy to Vercel** (2 minutes)
4. **Share link** with your team
5. **Gather feedback** and improve

## 💡 Tips

- Use Chrome DevTools (F12) to debug
- Check browser console for errors
- Look at Supabase logs for DB issues
- Use Vercel Analytics to monitor performance

## 🎓 Learning Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [React Hooks](https://react.dev/reference/react/hooks)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📞 Need Help?

Check these files for detailed info:
- `SETUP.md` - Detailed setup guide
- `DEVELOPMENT.md` - Architecture and roadmap
- `MVP_STATUS.md` - Current status

---

**Good luck! 🚀**  
Contact: contact.ssdcommunication@gmail.com
