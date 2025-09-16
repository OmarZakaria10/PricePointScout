# SIMPLE MONITORING GUIDE FOR BEGINNERS

## What is Monitoring?
Think of monitoring like a dashboard in your car - it shows you:
- Is your app running? (like checking if engine is on)
- How much resources is it using? (like fuel gauge)
- Are there any problems? (like warning lights)

## What We've Created:

### 1. **Prometheus** 📊
- **What it does**: Collects data about your app (like a data collector)
- **Think of it as**: A person taking notes about how your app is doing every few seconds

### 2. **Grafana** 📈  
- **What it does**: Shows the data in pretty charts and graphs
- **Think of it as**: A TV screen that shows the notes in a visual way

### 3. **Health Checks** 🏥
- **What it does**: Automatically checks if your app is working
- **Think of it as**: A doctor that checks your app's pulse every 30 seconds

## How to Use This:

### Step 1: Deploy the Monitoring
```bash
cd simple-monitoring
chmod +x deploy.sh
./deploy.sh
```

### Step 2: Add Health Check to Your App
Add this code to your Node.js app (in app.js or index.js):
```javascript
// Simple health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    time: new Date(),
    message: 'PricePointScout is running!' 
  });
});
```

### Step 3: View Your Dashboard
1. Run: `kubectl port-forward svc/grafana 3000:3000 -n monitoring`
2. Open: http://localhost:3000
3. Login: admin / admin123
4. Create dashboards to see your app's health!

## What You'll See:

### ✅ Green = Good
- Your app is running
- Memory/CPU usage is normal
- No errors

### ⚠️ Yellow = Warning  
- App is running but using lots of resources
- Might need attention soon

### ❌ Red = Problem
- App is down
- Out of memory
- Need to fix immediately

## Simple Commands to Remember:

### Check if monitoring is running:
```bash
kubectl get pods -n monitoring
```

### View logs if something is broken:
```bash
kubectl logs -f deployment/grafana -n monitoring
kubectl logs -f deployment/prometheus -n monitoring
```

### Access your dashboards:
```bash
# For Grafana (pretty charts)
kubectl port-forward svc/grafana 3000:3000 -n monitoring

# For Prometheus (raw data)
kubectl port-forward svc/prometheus 9090:9090 -n monitoring
```

## Why This Helps You:

1. **See Problems Early**: Know before users complain
2. **Understand Usage**: See when your app is busy
3. **Learn Patterns**: Understand how your price scraping affects performance
4. **Debug Issues**: Logs and metrics help find problems faster

## Next Steps (When You're Ready):
1. Learn to create custom Grafana dashboards
2. Set up alerts (emails when something breaks)
3. Monitor your database (MongoDB/Redis)
4. Add custom metrics for price scraping success rates

Remember: Start simple, learn gradually! 🚀
