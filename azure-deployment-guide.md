# Deploy React App to Azure Static Web Apps

## Method 1: Azure Portal (GUI)

### Step 1: Prepare Your Repository
1. Push your code to GitHub if not already done
2. Ensure your `package.json` has the correct build script:
   ```json
   {
     "scripts": {
       "build": "vite build",
       "preview": "vite preview"
     }
   }
   ```

### Step 2: Create Azure Static Web App
1. Go to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource"
3. Search for "Static Web App" and select it
4. Click "Create"
5. Fill in the details:
   - **Subscription**: Choose your subscription
   - **Resource Group**: Create new or select existing
   - **Name**: `azure-cleanrooms-app` (or your preferred name)
   - **Plan type**: Free (for development) or Standard (for production)
   - **Region**: Choose closest to your users
   - **Source**: GitHub
   - **GitHub account**: Sign in to your GitHub
   - **Organization**: Your GitHub username
   - **Repository**: Select your repository
   - **Branch**: `main` or your default branch
   - **Build presets**: React
   - **App location**: `/` (root)
   - **Api location**: (leave empty if no API)
   - **Output location**: `dist`

6. Click "Review + Create" then "Create"

### Step 3: Automatic Deployment
- Azure will automatically create a GitHub Actions workflow
- Your app will be built and deployed automatically
- You'll get a URL like: `https://wonderful-sea-123456.azurestaticapps.net`

## Method 2: Azure CLI

### Prerequisites
Install Azure CLI:
```bash
# Windows
winget install Microsoft.AzureCLI

# Or download from: https://aka.ms/installazurecliwindows
```

### Commands
```bash
# Login to Azure
az login

# Create resource group
az group create --name cleanrooms-rg --location "East US"

# Create static web app
az staticwebapp create \
  --name azure-cleanrooms-app \
  --resource-group cleanrooms-rg \
  --source https://github.com/YOUR_USERNAME/YOUR_REPO \
  --location "East US2" \
  --branch main \
  --app-location "/" \
  --output-location "dist"
```

## Method 3: GitHub Actions (Manual Setup)

### Create workflow file
Create `.github/workflows/azure-static-web-apps.yml`:

```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          api_location: ""
          output_location: "dist"

  close_pull_request_job:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request Job
    steps:
      - name: Close Pull Request
        id: closepullrequest
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: "close"
```

## Configuration Adjustments

### Update Vite Config for Azure
Update `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Ensure correct base path
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  server: {
    port: 3000
  }
})
```

### Add staticwebapp.config.json (Optional)
Create `public/staticwebapp.config.json` for routing:

```json
{
  "routes": [
    {
      "route": "/*",
      "serve": "/index.html",
      "statusCode": 200
    }
  ],
  "mimeTypes": {
    ".json": "application/json"
  }
}
```

## Alternative Hosting Options

### Option A: Azure App Service
- More expensive but more features
- Good for full-stack applications
- Supports custom domains easily

### Option B: Azure Storage Static Website
- Cheapest option
- No custom domains on free tier
- Good for simple static sites

### Option C: Azure Container Instances
- If you want to containerize the app
- More complex setup
- Good for microservices architecture

## Post-Deployment Steps

1. **Custom Domain** (Optional):
   - Go to your Static Web App in Azure Portal
   - Navigate to "Custom domains"
   - Add your domain and configure DNS

2. **Environment Variables**:
   - Add any needed environment variables in Azure Portal
   - Go to Configuration > Application settings

3. **Monitoring**:
   - Enable Application Insights for monitoring
   - Set up alerts for errors or performance issues

## Estimated Costs

- **Static Web Apps Free Tier**: $0 (100GB bandwidth/month)
- **Static Web Apps Standard**: ~$9/month (unlimited bandwidth)
- **Custom domains**: Included in Standard tier

## Troubleshooting

### Common Issues:
1. **Build fails**: Check build logs in GitHub Actions
2. **Routes not working**: Add staticwebapp.config.json
3. **Assets not loading**: Check base path in vite.config.ts

### Support Resources:
- [Azure Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [GitHub Actions for Azure](https://github.com/marketplace/actions/azure-static-web-apps-deploy)