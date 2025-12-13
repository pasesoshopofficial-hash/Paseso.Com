$file = "js/legacy.js"
$content = Get-Content $file -Raw -Encoding UTF8

# Fix corrupted UTF-8 characters
$content = $content -replace "â€™", "'"
$content = $content -replace "â€'", "-"
$content = $content -replace "â€"", "-"
$content = $content -replace "â€"", "-"
$content = $content -replace "ðŸš€", ""
$content = $content -replace "ðŸ"ˆ", ""
$content = $content -replace "ðŸŽ", ""
$content = $content -replace "ðŸ¤", ""

Set-Content $file -Value $content -Encoding UTF8 -NoNewline
Write-Host "Encoding fixed!"
