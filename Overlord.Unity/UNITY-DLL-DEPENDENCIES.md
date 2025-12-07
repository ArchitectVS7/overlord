# Unity DLL Dependencies Reference

**Last Updated:** 2025-12-07
**Unity Version:** 6000.3.0f1
**Target Framework:** .NET Standard 2.1

---

## Required DLLs in Assets/Plugins/Overlord.Core/

Unity requires ALL transitive dependencies to be present. Here's the complete list:

### 1. Overlord.Core.dll (118 KB)
**Source:** `Overlord.Core/bin/Release/netstandard2.1/Overlord.Core.dll`
**Purpose:** Main game logic (all 18 Core systems)
**Build Command:**
```bash
cd Overlord.Core
dotnet build Overlord.Core/Overlord.Core.csproj --configuration Release
```

### 2. System.Text.Json.dll (344 KB)
**Source:** `~/.nuget/packages/system.text.json/5.0.2/lib/netstandard2.0/System.Text.Json.dll`
**Purpose:** JSON serialization for save/load system
**Version:** 5.0.2 (highest compatible with .NET Standard 2.1)

### 3. System.Text.Encodings.Web.dll (67 KB)
**Source:** `~/.nuget/packages/system.text.encodings.web/5.0.1/lib/netstandard2.0/System.Text.Encodings.Web.dll`
**Purpose:** Required dependency of System.Text.Json
**Version:** 5.0.1

### 4. Microsoft.Bcl.AsyncInterfaces.dll (21 KB)
**Source:** `~/.nuget/packages/microsoft.bcl.asyncinterfaces/5.0.0/lib/netstandard2.0/Microsoft.Bcl.AsyncInterfaces.dll`
**Purpose:** Required dependency of System.Text.Json
**Version:** 5.0.0

### 5. System.Runtime.CompilerServices.Unsafe.dll (17 KB)
**Source:** `~/.nuget/packages/system.runtime.compilerservices.unsafe/5.0.0/lib/netstandard2.0/System.Runtime.CompilerServices.Unsafe.dll`
**Purpose:** Required dependency of System.Text.Encodings.Web and AsyncInterfaces
**Version:** 5.0.0

---

## Dependency Chain

```
Overlord.Core.dll
    └─ System.Text.Json.dll (5.0.2)
        ├─ System.Text.Encodings.Web.dll (5.0.1)
        │   └─ System.Runtime.CompilerServices.Unsafe.dll (5.0.0)
        └─ Microsoft.Bcl.AsyncInterfaces.dll (5.0.0)
            └─ System.Runtime.CompilerServices.Unsafe.dll (5.0.0)
```

---

## Complete Copy Script

**PowerShell (Windows):**
```powershell
# From project root
$pluginsDir = "Overlord.Unity/Assets/Plugins/Overlord.Core"

# 1. Core DLL
Copy-Item "Overlord.Core/Overlord.Core/bin/Release/netstandard2.1/Overlord.Core.dll" $pluginsDir

# 2. System.Text.Json and dependencies
Copy-Item "$env:USERPROFILE/.nuget/packages/system.text.json/5.0.2/lib/netstandard2.0/System.Text.Json.dll" $pluginsDir
Copy-Item "$env:USERPROFILE/.nuget/packages/system.text.encodings.web/5.0.1/lib/netstandard2.0/System.Text.Encodings.Web.dll" $pluginsDir
Copy-Item "$env:USERPROFILE/.nuget/packages/microsoft.bcl.asyncinterfaces/5.0.0/lib/netstandard2.0/Microsoft.Bcl.AsyncInterfaces.dll" $pluginsDir
Copy-Item "$env:USERPROFILE/.nuget/packages/system.runtime.compilerservices.unsafe/5.0.0/lib/netstandard2.0/System.Runtime.CompilerServices.Unsafe.dll" $pluginsDir

Write-Host "All DLLs copied successfully!" -ForegroundColor Green
```

**Bash (Linux/Mac/Git Bash):**
```bash
# From project root
PLUGINS_DIR="Overlord.Unity/Assets/Plugins/Overlord.Core"

# 1. Core DLL
cp Overlord.Core/Overlord.Core/bin/Release/netstandard2.1/Overlord.Core.dll $PLUGINS_DIR/

# 2. System.Text.Json and dependencies
cp ~/.nuget/packages/system.text.json/5.0.2/lib/netstandard2.0/System.Text.Json.dll $PLUGINS_DIR/
cp ~/.nuget/packages/system.text.encodings.web/5.0.1/lib/netstandard2.0/System.Text.Encodings.Web.dll $PLUGINS_DIR/
cp ~/.nuget/packages/microsoft.bcl.asyncinterfaces/5.0.0/lib/netstandard2.0/Microsoft.Bcl.AsyncInterfaces.dll $PLUGINS_DIR/
cp ~/.nuget/packages/system.runtime.compilerservices.unsafe/5.0.0/lib/netstandard2.0/System.Runtime.CompilerServices.Unsafe.dll $PLUGINS_DIR/

echo "All DLLs copied successfully!"
```

---

## Verification Checklist

After copying DLLs, verify:

- [ ] All 5 DLLs present in `Assets/Plugins/Overlord.Core/`
- [ ] Unity generates .meta files automatically
- [ ] Console shows no "Unable to resolve reference" errors
- [ ] GameManager.cs compiles without CS1705 errors
- [ ] Play mode can be entered

**Expected file list:**
```
Assets/Plugins/Overlord.Core/
├── Overlord.Core.dll (118 KB)
├── Overlord.Core.dll.meta
├── System.Text.Json.dll (344 KB)
├── System.Text.Json.dll.meta
├── System.Text.Encodings.Web.dll (67 KB)
├── System.Text.Encodings.Web.dll.meta
├── Microsoft.Bcl.AsyncInterfaces.dll (21 KB)
├── Microsoft.Bcl.AsyncInterfaces.dll.meta
├── System.Runtime.CompilerServices.Unsafe.dll (17 KB)
└── System.Runtime.CompilerServices.Unsafe.dll.meta
```

---

## Common Errors & Solutions

### Error: "Reference has errors 'System.Text.Json'"

**Cause:** Missing transitive dependencies
**Solution:** Copy all 5 DLLs using script above

### Error: "Unable to resolve reference 'System.Text.Encodings.Web'"

**Cause:** System.Text.Encodings.Web.dll not copied
**Solution:**
```bash
cp ~/.nuget/packages/system.text.encodings.web/5.0.1/lib/netstandard2.0/System.Text.Encodings.Web.dll \
   Overlord.Unity/Assets/Plugins/Overlord.Core/
```

### Error: "Unable to resolve reference 'Microsoft.Bcl.AsyncInterfaces'"

**Cause:** Microsoft.Bcl.AsyncInterfaces.dll not copied
**Solution:**
```bash
cp ~/.nuget/packages/microsoft.bcl.asyncinterfaces/5.0.0/lib/netstandard2.0/Microsoft.Bcl.AsyncInterfaces.dll \
   Overlord.Unity/Assets/Plugins/Overlord.Core/
```

### Error: "Assembly will not be loaded due to errors"

**Cause:** Incompatible .NET version (e.g., net8.0 instead of netstandard2.1)
**Solution:** Rebuild Overlord.Core for netstandard2.1:
```bash
cd Overlord.Core
dotnet build Overlord.Core/Overlord.Core.csproj --configuration Release
```

---

## Why Unity Needs All These DLLs

Unity's .NET runtime is strict about dependencies:

1. **No NuGet in Unity:** Unity can't download packages automatically
2. **Explicit Dependencies:** Every transitive dependency must be physically present
3. **Version Locking:** Unity doesn't resolve version conflicts like NuGet does
4. **AOT Compilation:** Ahead-of-time compilation requires all references at build time

**In .NET projects:** NuGet handles transitive dependencies automatically
**In Unity:** You must manually copy every single DLL in the dependency tree

---

## Updating Core DLL After Changes

Whenever you modify Overlord.Core code:

1. **Build Core:**
   ```bash
   cd Overlord.Core
   dotnet build Overlord.Core/Overlord.Core.csproj --configuration Release
   ```

2. **Copy ONLY Overlord.Core.dll:**
   ```bash
   cp Overlord.Core/bin/Release/netstandard2.1/Overlord.Core.dll \
      ../Overlord.Unity/Assets/Plugins/Overlord.Core/
   ```

3. **Restart Unity** (if open)

**Note:** You DON'T need to recopy the System.Text.Json dependencies unless you:
- Update System.Text.Json version in Overlord.Core.csproj
- Delete the Plugins folder
- Switch Unity projects

---

## Alternative: Disable Reference Validation (NOT RECOMMENDED)

Unity allows disabling reference validation, but this can cause runtime crashes:

1. Select DLL in Unity Project window
2. In Inspector: Platform Settings → Any Platform
3. Uncheck "Validate References"
4. Click Apply

**Why not recommended:**
- Runtime crashes with cryptic errors
- Hard to debug
- Better to fix dependencies properly

---

## Version Compatibility Table

| Package | Version | .NET Standard 2.1 | Unity 6 |
|---------|---------|-------------------|---------|
| System.Text.Json | 5.0.2 | ✅ | ✅ |
| System.Text.Json | 6.0.0+ | ✅ | ⚠️ (might work) |
| System.Text.Json | 8.0.0+ | ❌ | ❌ |
| System.Text.Encodings.Web | 5.0.1 | ✅ | ✅ |
| Microsoft.Bcl.AsyncInterfaces | 5.0.0 | ✅ | ✅ |
| System.Runtime.CompilerServices.Unsafe | 5.0.0 | ✅ | ✅ |

**Rule of thumb:** Use 5.x versions for maximum Unity compatibility

---

## Troubleshooting Commands

**Check NuGet cache:**
```bash
ls ~/.nuget/packages/system.text.json/
```

**Find missing DLL:**
```bash
find ~/.nuget/packages -name "System.Text.Encodings.Web.dll" | grep netstandard2.0
```

**Verify DLL copied:**
```bash
ls -lh Overlord.Unity/Assets/Plugins/Overlord.Core/
```

**Clear Unity cache (if needed):**
```bash
# Close Unity first!
rm -rf Overlord.Unity/Library/
# Reopen Unity (will rebuild library)
```

---

## Quick Reference

**Problem:** "Reference has errors" in Unity Console
**Solution:** Run the complete copy script from this document

**Problem:** CS1705 errors about System.Runtime
**Solution:** Rebuild Overlord.Core for netstandard2.1

**Problem:** DLL copied but still errors
**Solution:** Restart Unity Editor

---

**END OF DLL DEPENDENCIES REFERENCE**
