# Vercel Deployment Guide

This guide will help you deploy your Statamic site to Vercel using Static Site Generation (SSG).

## 📋 Prerequisites

1. ✅ Statamic SSG package installed
2. ✅ GitHub account with repository set up
3. ✅ Vercel account (free tier works)
4. ✅ Vercel CLI installed globally

## 🚀 Initial Setup

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Link Your Project to Vercel

From your project root, run:

```bash
vercel
```

This will:
- Ask you to confirm your project settings
- Create a new Vercel project
- Link your local project to it
- Give you `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`

### Step 4: Generate Application Key

```bash
php artisan key:generate --show
```

Copy the output (it looks like `base64:...`)

### Step 5: Set Environment Variables in Vercel

Go to your Vercel dashboard → Your Project → Settings → Environment Variables

Add these:

| Variable | Value | Environment |
|----------|-------|-------------|
| `APP_KEY` | Your generated key from Step 4 | Production |
| `APP_ENV` | `production` | Production |
| `APP_URL` | Your Vercel URL (e.g., `https://your-site.vercel.app`) | Production |
| `APP_DEBUG` | `false` | Production |

### Step 6: Configure GitHub Secrets (for GitHub Actions)

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:

| Secret | Where to Find |
|--------|---------------|
| `VERCEL_TOKEN` | Vercel Dashboard → Settings → Tokens → Create |
| `VERCEL_ORG_ID` | Run `vercel` locally, check `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Run `vercel` locally, check `.vercel/project.json` |

To get org/project IDs, run `vercel` once locally, then check the `.vercel/project.json` file.

## 📦 Deployment Methods

### Method 1: Manual Deployment via CLI

```bash
npm run deploy
```

This will:
1. Build your frontend assets with Vite
2. Generate the static site with SSG
3. Deploy to Vercel

### Method 2: Automatic Deployment via GitHub Actions

Every time you push to the `main` branch, GitHub Actions will:
1. Build your site
2. Generate static files
3. Deploy to Vercel automatically

Simply:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

### Method 3: Direct Vercel CLI Deployment

```bash
# Production deployment
vercel --prod

# Preview deployment
vercel
```

## 🔧 Vercel Project Configuration

In your Vercel dashboard, configure:

**Build & Development Settings:**
- Framework Preset: `Other`
- Build Command: `./build.sh`
- Output Directory: `storage/app/static`
- Install Command: Leave empty (handled in build.sh)

**Root Directory:** Leave as is (project root)

## 📝 Content Workflow

Since you're using SSG, here's how to update content:

1. **Edit content locally** - Modify `.md` files in `content/collections/`
2. **Test locally** - Run `php please ssg:generate` to test
3. **Commit changes** - `git add . && git commit -m "Update content"`
4. **Push to deploy** - `git push origin main`
5. **Auto-deploy** - GitHub Actions will rebuild and redeploy

Or use the manual CLI deployment:

```bash
npm run deploy
```

## 🛠️ Useful Commands

```bash
# Clear SSG cache
php please ssg:clear

# Generate static site locally
php please ssg:generate

# Generate with more workers (faster)
php please ssg:generate --workers=8

# Preview what will be generated
php please ssg:generate --dry-run

# Check Vercel deployment status
vercel list

# View deployment logs
vercel logs
```

## 🐛 Troubleshooting

### Build Fails on Vercel

1. Check build logs in Vercel dashboard
2. Verify environment variables are set correctly
3. Ensure `build.sh` has execute permissions (should be committed with chmod +x)

### Missing Pages in Static Build

Check [config/statamic/ssg.php](config/statamic/ssg.php) and ensure your routes are in the `urls` array:

```php
'urls' => [
    '/',
    '/blog',
    '/blog/*',
    '/projects',
    '/projects/*',
    // Add missing routes here
],
```

### Assets Not Loading

Ensure your public assets are listed in the `copy` section of [config/statamic/ssg.php](config/statamic/ssg.php):

```php
'copy' => [
    public_path('build') => 'build',
    public_path('css') => 'css',
    // etc...
],
```

### Images Not Showing

If using Glide (Statamic's image manipulation), ensure this is enabled in [config/statamic/ssg.php](config/statamic/ssg.php):

```php
'glide' => true,
```

## 🎯 Performance Tips

1. **Use appropriate workers** - More isn't always better. 4-8 is usually optimal
2. **Enable Glide caching** - Pre-generate all image sizes
3. **Minimize URLs** - Only generate pages you need
4. **Use Vercel's Analytics** - Monitor performance in Vercel dashboard

## 📚 Additional Resources

- [Statamic SSG Docs](https://github.com/statamic/ssg)
- [Vercel Statamic Guide](https://statamic.dev/deploying/vercel)
- [Vercel CLI Docs](https://vercel.com/docs/cli)

## 🔒 Security Notes

- Never commit `.env` files
- Keep `APP_KEY` secret
- Use environment variables for sensitive data
- Set `APP_DEBUG=false` in production

---

## ✅ Ready to Deploy?

Run this command when you're ready:

```bash
npm run deploy
```

Good luck! 🚀
