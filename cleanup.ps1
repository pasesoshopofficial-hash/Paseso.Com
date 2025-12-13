# PASESO Index.html Cleanup Script
# Removes inline CSS and JavaScript, keeping only external file references

$inputFile = "index.html"
$outputFile = "index-clean.html"

Write-Host "Reading $inputFile..." -ForegroundColor Cyan
$lines = Get-Content $inputFile -Encoding UTF8

$output = New-Object System.Collections.ArrayList

# State flags
$inInlineStyle = $false
$inInlineScript = $false
$styleSkipped = $false
$scriptSkipped = $false

for ($i = 0; $i -lt $lines.Length; $i++) {
    $line = $lines[$i]
    $lineNum = $i + 1
    
    # Detect inline style start (line 51)
    if ($line -match '^\s*<style>\s*$' -and -not $styleSkipped) {
        $inInlineStyle = $true
        Write-Host "Skipping inline <style> starting at line $lineNum" -ForegroundColor Yellow
        continue
    }
    
    # Detect inline style end
    if ($inInlineStyle -and $line -match '^\s*</style>\s*$') {
        $inInlineStyle = $false
        $styleSkipped = $true
        Write-Host "Finished skipping inline style at line $lineNum" -ForegroundColor Green
        continue
    }
    
    # Skip lines inside inline style
    if ($inInlineStyle) {
        continue
    }
    
    # Detect inline script start (line 985) - looking for <script> without src
    if ($line -match '^\s*<script>\s*$' -and -not $scriptSkipped) {
        $inInlineScript = $true
        Write-Host "Skipping inline <script> starting at line $lineNum" -ForegroundColor Yellow
        continue
    }
    
    # Detect inline script end
    if ($inInlineScript -and $line -match '^\s*</script>\s*$') {
        $inInlineScript = $false
        $scriptSkipped = $true
        Write-Host "Finished skipping inline script at line $lineNum" -ForegroundColor Green
        continue
    }
    
    # Skip lines inside inline script
    if ($inInlineScript) {
        continue
    }
    
    # Keep all other lines
    [void]$output.Add($line)
}

# Write output
Write-Host "`nWriting clean file to $outputFile..." -ForegroundColor Cyan
$output -join "`n" | Out-File $outputFile -Encoding UTF8

$originalLines = $lines.Length
$cleanLines = $output.Count
$removed = $originalLines - $cleanLines

Write-Host "`n=== Cleanup Complete ===" -ForegroundColor Green
Write-Host "Original lines: $originalLines" -ForegroundColor White
Write-Host "Clean lines: $cleanLines" -ForegroundColor White  
Write-Host "Lines removed: $removed" -ForegroundColor Yellow

Write-Host "`nTo apply changes, run:" -ForegroundColor Cyan
Write-Host "Move-Item index.html index-backup.html" -ForegroundColor Gray
Write-Host "Move-Item index-clean.html index.html" -ForegroundColor Gray
