# 🚀 Final Deployment Steps - Workshop Manager

## Current Status
✅ Code migrated to `SSDcommunication/manager-workshop`
✅ All 14 menu items + features implemented
✅ GitHub Actions workflow configured
✅ Ready for production deployment

## What's Currently Wrong
- Vercel is showing "SSD - WEBINAR MANAGER" (old version)
- Menu only has 5 items instead of 14
- Vercel is pointing to old `ssd-workshop/apps/workshop-manager` instead of `manager-workshop`

## Step-by-Step Fix (5 minutes)

### Step 1: Change Vercel Repository (CRITICAL)

1. Go to **https://vercel.com/dashboard**
2. Click on project **`workshop-manager-six`**
3. Go to **Settings** tab (top)
4. Find **Git** section on left
5. Under **Connected Git Repository:**
   - You should see: `SSDcommunication/ssd-workshop` 
   - Click the **x** or **Disconnect** button
   - Click **Connect Repository**
   - Search for and select **`SSDcommunication/manager-workshop`**

### Step 2: Verify Root Directory

Still in Settings → Git:
- **Production Branch**: `main` ✅
- **Root Directory**: Must be `.` (NOT `apps/workshop-manager`)
- **Build Command**: `npm run build` ✅
- Click **Save**

### Step 3: Trigger Redeploy

Option A (Automatic):
```bash
cd /workspace/manager-workshop
./scripts/force-redeploy.sh
```

Option B (Manual via Dashboard):
1. Go to **Deployments** tab in Vercel
2. Click **Redeploy** on latest commit
3. Wait for build to complete

### Step 4: Verify Deployment

After 2-3 minutes, check:
1. Go to **https://workshop-manager-six.vercel.app/**
2. Should show **"SSD - WORKSHOP MANAGER"** ✅
3. Sidebar should have **14 items** ✅
4. All managers working (Types, Ateliers, Événements, etc.) ✅

---

## Troubleshooting

### Still showing "SSD - WEBINAR MANAGER"?
- ✅ Vercel repository is STILL pointing to ssd-workshop
- Solution: Complete Step 1 above

### Getting 404 errors on some pages?
- Check that Root Directory is `.` not `apps/workshop-manager`
- Rebuild should work after fix

### Build failing in Vercel?
- Verify Node.js version: Should be 18+ (check in Settings → Environment)
- Check build logs in Vercel for errors

---

## Success Indicators

When deployment is complete:
- ✅ Site title: "SSD - WORKSHOP MANAGER"
- ✅ Sidebar has: Vue d'ensemble, Types d'ateliers, Ateliers, Événements, Participants, Documents, Tâches, Programme, Réseaux sociaux, Emails, Budget, Témoignages, Prospection, Landing page
- ✅ Dashboard shows KPI cards
- ✅ Types page shows 9 ateliers (IKIGAI, and 8 others)
- ✅ All pages render without 404 errors

---

## Automatic Future Deployments

After Vercel is configured:
- Every push to `manager-workshop/main` will automatically redeploy
- GitHub Actions will handle deployment (when secrets are configured)
- Or use: `./scripts/force-redeploy.sh` to manually trigger

---

## Commands Reference

```bash
# Trigger immediate redeploy
cd /workspace/manager-workshop && ./scripts/force-redeploy.sh

# Or manual commit + push
git commit --allow-empty -m "Force Vercel redeploy: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
git push origin main

# Check git status
git status

# View recent commits
git log --oneline -5
```

---

## Key Information

- **Vercel Project**: workshop-manager-six
- **Production Domain**: https://workshop-manager-six.vercel.app/
- **Git Repository**: https://github.com/SSDcommunication/manager-workshop
- **Default Branch**: main
- **Latest Commit**: e9273bd (Add automatic GitHub Actions deployment workflow)

---

**Time to Complete**: 5-10 minutes
**Difficulty**: Easy (mostly clicking in Vercel UI)
**Critical Step**: Step 1 (changing repository connection)
