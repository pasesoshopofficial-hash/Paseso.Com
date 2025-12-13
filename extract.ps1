# Extract JavaScript from index.html
$lines = Get-Content "index.html"
$startLine = 985
$endLine = 6885
$jsLines = $lines[($startLine-1)..($endLine-1)]

$header = @"
/**
 * PASESO Legacy JavaScript
 * Migrated from inline script in index.html
 * Powered in Romania
 */

"@

$output = $header + ($jsLines -join "`n")
$output | Out-File "js/legacy.js" -Encoding UTF8
Write-Host "Extracted" ($endLine - $startLine + 1) "lines to js/legacy.js"
