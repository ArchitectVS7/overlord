# Overlord - Alpha Tester Quick Start Guide

**Welcome, Alpha Tester!** Thank you for helping us test Overlord, a modern remake of the classic 4X space strategy game. This guide will help you get started and provide effective feedback.

---

## 🎮 What You're Testing

**Overlord** is a turn-based space strategy game where you:
- **Explore** a procedurally generated galaxy (4-6 planets)
- **Expand** your empire by colonizing neutral worlds
- **Exploit** planetary resources to build your economy
- **Exterminate** AI opponents with distinct personalities

**Current Build:** Pre-Alpha (Functional Prototype)
- ✅ All gameplay mechanics working
- ✅ Two game modes: Campaign & Flash Conflicts (tutorials)
- ⚠️ Placeholder graphics (shapes and text only)
- ⚠️ No audio yet

**Estimated Play Time:**
- Tutorial scenarios: 5-15 minutes each
- Full campaign: 30-60 minutes

---

## 🚀 Getting Started

### Option 1: Play Online (Recommended)
**URL:** [Coming Soon - Will be provided via email]

Just click the link and play in your browser. No installation needed!

### Option 2: Run Locally (Advanced)
If you have Node.js 18+ installed:

```bash
# Clone the repository (link provided separately)
git clone <repo-url>
cd overlord/Overlord.Phaser

# Install dependencies
npm install

# Start the game
npm start
```

The game will open at `http://localhost:8080`

---

## 🎯 How to Play

### Tutorial Mode (Recommended Start)
1. **Main Menu** → Click "FLASH CONFLICTS"
2. **Select Tutorial** → "First Steps" (easiest)
3. Follow on-screen instructions to learn the basics

### Campaign Mode (Full Game)
1. **Main Menu** → Click "NEW CAMPAIGN"
2. **Configure Game:**
   - Difficulty: Easy / Normal / Hard
   - AI Personality: Aggressive / Defensive / Economic / Balanced
3. **Start Playing!**

### Basic Controls

**Mouse:**
- **Click planet** = Select planet (opens info panel)
- **Click panel background** = Close panel
- **Mouse wheel** = Zoom in/out on galaxy map
- **Click & drag** = Pan galaxy map

**Keyboard:**
- **Space / Enter** = End turn (advance game)
- **Escape** = Close current panel
- **H** = Help overlay (keyboard shortcuts)
- **Ctrl+M** = Mute audio (when implemented)

**Touch (Mobile):**
- **Tap planet** = Select
- **Pinch** = Zoom
- **Two-finger drag** = Pan map

---

## 🎲 Game Mechanics Overview

### Resources (5 types)
- **Credits** 💰 - Universal currency (yellow)
- **Minerals** 🪨 - Building materials (gray)
- **Fuel** ⛽ - Spacecraft propulsion (orange)
- **Food** 🌾 - Population growth (green)
- **Energy** ⚡ - Technology and defense (cyan)

### Turn Phases
Each turn has 4 phases (shown in top HUD):
1. **Income** - Collect resources from planets
2. **Action** - Build, recruit, move units
3. **Combat** - Battles resolve automatically
4. **End** - AI takes their turn

### Planet Actions
When you click your planet:
- **Build** - Construct buildings (mines, factories, etc.)
- **Commission** - Create platoons (ground troops)
- **Spacecraft** - Purchase ships (scouts, battle cruisers)
- **Platoons** - View/manage ground forces
- **Navigate** - Move spacecraft between planets
- **Invade** - Attack enemy planets (when in orbit)

### Victory & Defeat
- **Win** - Conquer all enemy planets
- **Lose** - Lose all your planets

---

## 🐛 What We Need You to Test

### Critical Test Areas

**1. Game Balance**
- Is the game too easy / too hard?
- Do you run out of resources frequently?
- Is the AI challenging but fair?

**2. User Interface**
- Can you understand what each button does?
- Are resource displays clear?
- Do you know what to do next?

**3. Tutorial Quality**
- Do the tutorials teach the mechanics effectively?
- Are instructions clear?
- What confused you?

**4. Bugs & Errors**
- Does the game crash or freeze?
- Do resources go negative incorrectly?
- Does combat work as expected?

**5. Pacing & Fun**
- Is the game engaging?
- Do turns feel too slow or too fast?
- What features are missing that you want?

---

## 📝 How to Report Issues

### Using the Feedback Form
After each session, please fill out the feedback form:
**[Link will be provided via email]**

### Bug Report Template
When reporting bugs, please include:

```
**What happened:**
[Describe the issue]

**Expected behavior:**
[What should have happened]

**Steps to reproduce:**
1. Start campaign on Normal difficulty
2. Click planet Alpha
3. Build Mining Station
4. [Bug occurs]

**Screenshot/Recording:**
[Attach if possible]

**Browser/Device:**
Chrome 120 on Windows 11 / Safari on iPhone 15
```

### Where to Report
- **Game-breaking bugs** - Email directly: [Your email here]
- **Suggestions** - Use the feedback form
- **Quick comments** - Discord channel: [Link if applicable]

---

## 🤔 Known Issues (Don't Report These)

We already know about these:

✅ **Graphics are placeholders** - Planets are colored circles, not sprites
✅ **No sound effects or music** - Audio system is disabled for now
✅ **Text-only UI** - Final version will have icons and graphics
✅ **Mobile layout rough** - Desktop experience is more polished
✅ **No save/load yet** - Campaign must be played in one session

---

## 💡 Tips for Effective Testing

### First Session (30 min)
1. Play "First Steps" tutorial (5 min)
2. Play one campaign on Easy difficulty (20 min)
3. Fill out feedback form immediately (5 min)

### Second Session (60 min)
1. Try Normal or Hard difficulty
2. Test different AI personalities
3. Experiment with different strategies
4. Report any bugs found

### What Makes Good Feedback

**❌ Not helpful:**
- "The game is boring"
- "I don't like it"

**✅ Very helpful:**
- "After turn 10, I had too many credits but no minerals, making the game stall"
- "The 'Commission' button is unclear - I thought it meant military commission (officer)"
- "Tutorial step 3 didn't advance when I built the mining station"

---

## 🎨 About the Graphics

**Why placeholder graphics?**

We're testing the **gameplay mechanics first** before investing in art. The original 1990 game had minimal graphics too! Think of this as playing a board game prototype.

**What to focus on:**
- ❌ Don't worry about colors/shapes
- ✅ Focus on: Is the game fun? Do mechanics work?

**Coming soon:**
- Planet sprites (volcanic, ice, tropical, etc.)
- Spacecraft visuals (battle cruisers, scouts)
- UI icons for resources
- Combat animations
- Background music

---

## 🏆 Alpha Tester Perks

As a thank you for testing:
- ✨ Your name in the credits (if you want)
- 🎮 Early access to Beta build
- 📧 Direct input on features & balance
- 🎁 [Other rewards TBD]

---

## 📊 Testing Schedule

**Alpha Phase 1:** (Current)
- **Focus:** Core gameplay loop, balance, bugs
- **Duration:** 2-3 weeks
- **Target:** 20-30 testers

**Alpha Phase 2:** (Coming Soon)
- **Focus:** Polish, UI improvements, early art
- **Duration:** 2 weeks
- **Target:** 50+ testers

**Beta:** (Future)
- **Focus:** Full art, audio, cross-device testing
- **Public release**

---

## 🆘 Troubleshooting

### Game won't load
- Try a different browser (Chrome recommended)
- Clear browser cache (Ctrl+Shift+Delete)
- Disable browser extensions

### Game is laggy
- Close other browser tabs
- Try zooming out on galaxy map
- Use Chrome instead of Firefox/Safari

### Can't click buttons
- Make sure planet is selected first
- Check if button is grayed out (disabled)
- Try refreshing the page

### Lost in the game
- Press H for help overlay
- Return to main menu and try tutorial
- Check this guide's "How to Play" section

---

## 📞 Contact & Support

**Questions about testing?**
- Email: [Your support email]
- Discord: [Link if available]

**Found a critical bug?**
- Email immediately: [Your urgent contact]

**General feedback?**
- Use the feedback form after each session

---

## 🙏 Thank You!

Your feedback is invaluable. Every bug you report, every suggestion you make, and every minute you spend playing helps make Overlord better.

**We couldn't do this without you!**

---

## 📋 Quick Reference Card

```
╔══════════════════════════════════════╗
║  OVERLORD - ALPHA QUICK REFERENCE   ║
╠══════════════════════════════════════╣
║ CONTROLS                             ║
║ ────────────────────────────────────║
║ Click Planet      → Select/Info      ║
║ Space/Enter       → End Turn         ║
║ Esc               → Close Panel      ║
║ Mouse Wheel       → Zoom             ║
║ Click & Drag      → Pan Map          ║
║                                      ║
║ RESOURCES                            ║
║ ────────────────────────────────────║
║ 💰 Credits   - Currency              ║
║ 🪨 Minerals  - Building materials    ║
║ ⛽ Fuel      - Ship propulsion       ║
║ 🌾 Food      - Population growth     ║
║ ⚡ Energy    - Technology/defense    ║
║                                      ║
║ VICTORY                              ║
║ ────────────────────────────────────║
║ Conquer all enemy planets            ║
╚══════════════════════════════════════╝
```

**Pro tip:** Print or screenshot this card for quick reference while playing!

---

**Version:** Pre-Alpha v0.7.0
**Last Updated:** 2025-12-16
**Expected Test Duration:** 2-3 weeks

---

**Ready to play? Start with the tutorial and have fun conquering the galaxy! 🚀**

