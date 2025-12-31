# Quick Build - Auto Save & Build Skill

## Auto-Generated
- **Created**: 2025-12-30
- **Created By**: Master Skill Factory
- **Project**: Physical AI Textbook Hackathon
- **Reuse Count**: 0

## Purpose
Automatically rebuild the project after any code changes, image updates, or configuration modifications. Saves time by running build commands instantly without manual intervention.

## Trigger Phrases (Urdu/English)
- "build karo"
- "rebuild"
- "save and build"
- "update ho gaya, build karo"
- "changes save ho gayi"
- "image change ki hai"
- "code update kiya"
- "check karo build"
- "run build"

## When to Use
- After editing any file in `src/`
- After adding/changing images in `static/img/`
- After modifying `docusaurus.config.ts`
- After updating any `.md` or `.mdx` files in `docs/`
- After changing CSS/styles
- After any frontend code change

## Execution Steps

### Step 1: Quick Build (Frontend Only)
```bash
cd physical-ai-book-main && npm run build 2>&1 | tail -5
```

### Step 2: Full Build with Cache Clear (If issues)
```bash
cd physical-ai-book-main && rm -rf .docusaurus build && npm run build
```

### Step 3: Start Dev Server (For live preview)
```bash
cd physical-ai-book-main && npm start
```

### Step 4: Serve Production Build
```bash
cd physical-ai-book-main && npm run serve
```

## Build Commands Reference

| Command | Purpose | Time |
|---------|---------|------|
| `npm run build` | Production build | ~30-60s |
| `npm start` | Dev server (hot reload) | ~10s |
| `npm run serve` | Serve production build | ~5s |
| `npm run clear` | Clear Docusaurus cache | ~2s |

## Common Scenarios

### Scenario 1: Image Changed
```
User: "image change ki hai" / "image update ho gayi"
Action: npm run build
Result: New images included in build
```

### Scenario 2: Code Updated
```
User: "code update kiya" / "component change kiya"
Action: npm run build
Result: TypeScript compiled, bundle updated
```

### Scenario 3: Config Changed
```
User: "config update ki" / "docusaurus.config change kiya"
Action: rm -rf .docusaurus && npm run build
Result: Fresh build with new config
```

### Scenario 4: Build Failing
```
User: "build fail ho raha hai"
Action:
1. npm run clear
2. rm -rf node_modules/.cache
3. npm run build
Result: Clean rebuild
```

### Scenario 5: Quick Preview
```
User: "preview dikhao" / "check karna hai"
Action: npm start
Result: Dev server at http://localhost:3000
```

## Error Recovery

### If Build Fails:
```bash
# Clear all caches
cd physical-ai-book-main
rm -rf .docusaurus build node_modules/.cache

# Rebuild
npm run build
```

### If TypeScript Error:
```bash
# Check types first
npx tsc --noEmit

# Then build
npm run build
```

### If Module Not Found:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Output Examples

### Successful Build:
```
[webpackbar] ✔ Server: Compiled successfully in 5.00s
[webpackbar] ✔ Client: Compiled successfully in 6.00s
[SUCCESS] Generated static files in "build".
```

### Failed Build:
```
[ERROR] Error: Something went wrong
→ Check the error message
→ Fix the issue
→ Run build again
```

## Integration

This skill works with:
- `build-error-handler` - If build fails, use that skill
- `project-intelligence` - Check project status before build

## Quick Reference Card

```
┌─────────────────────────────────────────┐
│         QUICK BUILD COMMANDS            │
├─────────────────────────────────────────┤
│  npm run build     → Production build   │
│  npm start         → Dev server         │
│  npm run serve     → Serve build        │
│  npm run clear     → Clear cache        │
├─────────────────────────────────────────┤
│  Dev Server:  http://localhost:3000     │
│  Prod Build:  http://localhost:3000     │
└─────────────────────────────────────────┘
```

---

## Version
- **Version**: 1.0.0
- **Category**: DevOps Skills
- **Integration**: Frontend (Docusaurus)
