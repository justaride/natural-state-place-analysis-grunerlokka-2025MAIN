# Fix Vercel Jekyll Build Error - Manual Steps

## Problem
Vercel is detecting the project as Jekyll instead of Next.js and trying to run `jekyll build`.

## Solution: Manual Vercel Dashboard Configuration

### Step 1: Go to Project Settings
1. Open https://vercel.com/dashboard
2. Select your project: `natural-state-place-analysis-grunerlokka-2025`
3. Click **Settings** (top navigation)

### Step 2: Update Build & Development Settings
1. Scroll to **Build & Development Settings** section
2. **Framework Preset**: Change from "Other" or "Jekyll" to **Next.js**
3. **Build Command**: `npm run build`
4. **Output Directory**: `.next`
5. **Install Command**: `npm install`
6. Click **Save**

### Step 3: Redeploy
1. Go to **Deployments** tab
2. Find the latest failed deployment
3. Click the **three dots menu** (⋯) → **Redeploy**
4. Or click **Deploy** button to trigger new deployment

## Alternative: Delete and Re-import Project

If the above doesn't work:

1. **Delete the project from Vercel**:
   - Settings → General → scroll to bottom
   - Click "Delete Project"
   - Type project name to confirm

2. **Re-import from GitHub**:
   - Dashboard → Add New → Project
   - Import from GitHub: `justaride/natural-state-place-analysis-grunerlokka-2025MAIN`
   - **Framework Preset**: Select **Next.js** (IMPORTANT!)
   - Leave other settings as default
   - Click Deploy

## Why This Happened

Vercel's automatic framework detection ran BEFORE reading `vercel.json`. Once it detected Python files in the repository, it incorrectly assumed Jekyll framework. The framework selection is then cached in Vercel's project settings and overrides the vercel.json configuration file.

## Verification

After redeploying, you should see in the build logs:
```
Building Next.js...
Running "npm run build"
```

Instead of:
```
sh: line 1: jekyll: command not found
```

---

**Important**: The vercel.json file we created is correct, but Vercel requires manual dashboard configuration when framework detection fails.
