# Unity Script Syntax Validator
# Usage: .\validate.ps1 <scriptPath>
# Example: .\validate.ps1 Assets\Scripts\UI\MainMenuUI.cs

param(
    [Parameter(Mandatory=$true)]
    [string]$scriptPath
)

# Colors for output
$ErrorColor = "Red"
$SuccessColor = "Green"
$WarningColor = "Yellow"

# Check if file exists
if (-not (Test-Path $scriptPath)) {
    Write-Host "FAIL: File not found: $scriptPath" -ForegroundColor $ErrorColor
    exit 1
}

Write-Host "`nValidating: $scriptPath" -ForegroundColor $WarningColor
Write-Host "=" * 60 -ForegroundColor $WarningColor

# Read file content
$content = Get-Content $scriptPath -Raw

# Validation counter
$errors = 0
$warnings = 0

# TEST 1: Brace Balance
Write-Host "`n[1/8] Checking brace balance..." -NoNewline
$openBraces = ($content.ToCharArray() | Where-Object { $_ -eq '{' }).Count
$closeBraces = ($content.ToCharArray() | Where-Object { $_ -eq '}' }).Count

if ($openBraces -ne $closeBraces) {
    Write-Host " FAIL" -ForegroundColor $ErrorColor
    Write-Host "  → Open braces: $openBraces, Close braces: $closeBraces" -ForegroundColor $ErrorColor
    $errors++
} else {
    Write-Host " PASS ($openBraces pairs)" -ForegroundColor $SuccessColor
}

# TEST 2: Parenthesis Balance
Write-Host "[2/8] Checking parenthesis balance..." -NoNewline
$openParens = ($content.ToCharArray() | Where-Object { $_ -eq '(' }).Count
$closeParens = ($content.ToCharArray() | Where-Object { $_ -eq ')' }).Count

if ($openParens -ne $closeParens) {
    Write-Host " FAIL" -ForegroundColor $ErrorColor
    Write-Host "  → Open parens: $openParens, Close parens: $closeParens" -ForegroundColor $ErrorColor
    $errors++
} else {
    Write-Host " PASS ($openParens pairs)" -ForegroundColor $SuccessColor
}

# TEST 3: Unity Lifecycle Method Typos
Write-Host "[3/8] Checking Unity lifecycle methods..." -NoNewline
$typos = @('awake', 'start', 'update', 'onEnable', 'onDisable', 'onDestroy', 'fixedUpdate', 'lateUpdate')
$foundTypos = @()

foreach ($typo in $typos) {
    if ($content -match "void\s+$typo\s*\(") {
        $foundTypos += $typo
    }
}

if ($foundTypos.Count -gt 0) {
    Write-Host " FAIL" -ForegroundColor $ErrorColor
    foreach ($typo in $foundTypos) {
        $correct = $typo.Substring(0,1).ToUpper() + $typo.Substring(1)
        Write-Host "  → Found lowercase 'void $typo()' - should be 'void $correct()'" -ForegroundColor $ErrorColor
    }
    $errors++
} else {
    Write-Host " PASS" -ForegroundColor $SuccessColor
}

# TEST 4: Namespace Check
Write-Host "[4/8] Checking namespace..." -NoNewline
if ($content -notmatch 'namespace\s+Overlord\.Unity') {
    Write-Host " WARN" -ForegroundColor $WarningColor
    Write-Host "  → No 'namespace Overlord.Unity.*' found" -ForegroundColor $WarningColor
    $warnings++
} else {
    Write-Host " PASS" -ForegroundColor $SuccessColor
}

# TEST 5: Class/Filename Match
Write-Host "[5/8] Checking class name matches filename..." -NoNewline
$filename = [System.IO.Path]::GetFileNameWithoutExtension($scriptPath)
if ($content -match "class\s+$filename\s*[:\s]") {
    Write-Host " PASS" -ForegroundColor $SuccessColor
} else {
    Write-Host " WARN" -ForegroundColor $WarningColor
    Write-Host "  → Class '$filename' not found (or named differently)" -ForegroundColor $WarningColor
    $warnings++
}

# TEST 6: Using Statements
Write-Host "[6/8] Checking using statements..." -NoNewline
$lines = $content -split "`n"
$firstNonCommentLine = $lines | Where-Object { $_ -notmatch '^\s*//' -and $_ -notmatch '^\s*$' } | Select-Object -First 1

if ($firstNonCommentLine -match '^using\s+') {
    Write-Host " PASS" -ForegroundColor $SuccessColor
} else {
    Write-Host " WARN" -ForegroundColor $WarningColor
    Write-Host "  → First non-comment line should be 'using' statement" -ForegroundColor $WarningColor
    $warnings++
}

# TEST 7: Semicolon Check (basic)
Write-Host "[7/8] Checking for missing semicolons..." -NoNewline
$suspiciousLines = @()
foreach ($line in $lines) {
    # Skip comments, braces, and empty lines
    if ($line -match '^\s*//' -or $line -match '^\s*[{}]\s*$' -or $line -match '^\s*$') {
        continue
    }

    # Check for lines that look like statements but don't end with semicolon, brace, or are not method declarations
    if ($line -match '\S' -and $line -notmatch '[{};]\s*$' -and $line -notmatch '^\s*(public|private|protected|internal|static|virtual|override|abstract).*\([^)]*\)\s*$') {
        # Likely missing semicolon
        $suspiciousLines += $line.Trim()
    }
}

if ($suspiciousLines.Count -gt 0 -and $suspiciousLines.Count -lt 5) {
    Write-Host " WARN" -ForegroundColor $WarningColor
    Write-Host "  → Found $($suspiciousLines.Count) potentially missing semicolons (manual check recommended)" -ForegroundColor $WarningColor
    $warnings++
} elseif ($suspiciousLines.Count -ge 5) {
    Write-Host " FAIL" -ForegroundColor $ErrorColor
    Write-Host "  → Found $($suspiciousLines.Count) lines possibly missing semicolons" -ForegroundColor $ErrorColor
    $errors++
} else {
    Write-Host " PASS" -ForegroundColor $SuccessColor
}

# TEST 8: MonoBehaviour Check (if applicable)
Write-Host "[8/8] Checking MonoBehaviour inheritance..." -NoNewline
if ($content -match 'class\s+\w+\s*:\s*MonoBehaviour') {
    if ($content -match 'using\s+UnityEngine;') {
        Write-Host " PASS" -ForegroundColor $SuccessColor
    } else {
        Write-Host " FAIL" -ForegroundColor $ErrorColor
        Write-Host "  → MonoBehaviour used but 'using UnityEngine;' not found" -ForegroundColor $ErrorColor
        $errors++
    }
} else {
    Write-Host " N/A (not a MonoBehaviour)" -ForegroundColor $WarningColor
}

# Summary
Write-Host "`n" + ("=" * 60) -ForegroundColor $WarningColor
if ($errors -gt 0) {
    Write-Host "VALIDATION FAILED" -ForegroundColor $ErrorColor
    Write-Host "  Errors: $errors" -ForegroundColor $ErrorColor
    Write-Host "  Warnings: $warnings" -ForegroundColor $WarningColor
    Write-Host "`nDO NOT copy to Unity until all errors are fixed!" -ForegroundColor $ErrorColor
    exit 1
} elseif ($warnings -gt 0) {
    Write-Host "VALIDATION PASSED (with warnings)" -ForegroundColor $WarningColor
    Write-Host "  Warnings: $warnings" -ForegroundColor $WarningColor
    Write-Host "`nReview warnings before copying to Unity." -ForegroundColor $WarningColor
    exit 0
} else {
    Write-Host "VALIDATION PASSED" -ForegroundColor $SuccessColor
    Write-Host "  No errors or warnings found!" -ForegroundColor $SuccessColor
    Write-Host "`nSafe to copy to Unity!" -ForegroundColor $SuccessColor
    exit 0
}
