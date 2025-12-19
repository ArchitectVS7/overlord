# ⚡ QUICK START - Run This Now!

## 🎯 Goal
Discover your game's complete UI structure using automated tests

## ⏱️ Time Required
~10 minutes

## 📋 Steps

### 1️⃣ Start Dev Server
```bash
cd C:\dev\GIT\Overlord\Overlord.Phaser
npm run start
```
**Wait for:** `Server running at http://localhost:8080`

### 2️⃣ Run Discovery Tests (New Terminal)
```bash
cd C:\dev\GIT\Overlord\Overlord.Phaser
npm run test:e2e ui-discovery.spec.ts -- --headed
```
**What you'll see:** Browser opens, game loads, tests explore UI

### 3️⃣ Watch the Console
Look for:
```
🔍 EXPLORING: MainMenuScene
📝 Text Objects Found:
  "NEW CAMPAIGN" at (400, 200) [INTERACTIVE]
  "FLASH CONFLICTS" at (400, 250) [INTERACTIVE]
```

### 4️⃣ Check Screenshots
```bash
# View screenshots
ls test-results/

# Open in browser
start test-results/
```

### 5️⃣ View HTML Report
```bash
npx playwright show-report
```

## ✅ Success Looks Like

**Console output:**
- ✅ Game boots
- ✅ Scenes discovered
- ✅ Text objects found
- ✅ Interactive elements mapped

**Screenshots:**
- 📸 Main menu visible
- 📸 Multiple scenes captured
- 📸 UI elements clear

**HTML Report:**
- ✅ Some tests pass (even 1 is good!)
- ⚠️ Some tests may fail (expected!)
- 📊 Detailed logs available

## 🎯 What Happens Next

After you run this, share with me:
1. Did tests run? ✅/❌
2. Console output (key parts)
3. Screenshots look correct? ✅/❌
4. Any errors?

Then we:
1. Analyze results together
2. Fix any issues
3. Create turn cycle tests
4. Move to Phase 2 (manual playthrough)

## 📚 Full Documentation

- **COMPLETE-SUMMARY.md** - Everything explained
- **EXECUTION-PLAN.md** - Detailed step-by-step
- **TEST-SUITE-README.md** - Test documentation
- **This file** - Quick reference

## 🆘 If Something Goes Wrong

### "npm run test:e2e not found"
```bash
npm pkg set scripts.test:e2e="playwright test tests/e2e"
```

### "Port 8080 in use"
Kill the existing process and restart

### "Tests timeout"
Try increasing timeout or check dev server is running

### "Cannot find canvas"
Game might not be loading - check dev server logs

## 🎬 Ready?

**RUN IT NOW!** 🚀

```bash
# Terminal 1
npm run start

# Terminal 2  
npm run test:e2e ui-discovery.spec.ts -- --headed
```

**Then share results!** 📊
