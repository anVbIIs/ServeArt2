param (
    [string]$DocxPath,
    [string]$OutputPath
)

try {
    if (-not (Test-Path $DocxPath)) {
        Write-Error "File not found: $DocxPath"
        return
    }

    $TempDir = Join-Path $env:TEMP "docx_temp_$(Get-Date -Format 'yyyyMMddHHmmss')"
    New-Item -ItemType Directory -Path $TempDir -Force | Out-Null

    $TempZip = Join-Path $TempDir "temp_archive.zip"
    Copy-Item -Path $DocxPath -Destination $TempZip -Force
    Expand-Archive -Path $TempZip -DestinationPath $TempDir -Force

    $XmlPath = Join-Path $TempDir "word/document.xml"
    if (Test-Path $XmlPath) {
        $xmlText = Get-Content $XmlPath -Raw -Encoding UTF8
        
        # Match all paragraphs
        $pMatches = [regex]::Matches($xmlText, '(?s)<w:p\b[^>]*>(.*?)</w:p>')
        $Paragraphs = @()
        
        foreach ($pMatch in $pMatches) {
            $pInner = $pMatch.Groups[1].Value
            # Match all text segments in this paragraph
            $tMatches = [regex]::Matches($pInner, '(?s)<w:t\b[^>]*>(.*?)</w:t>')
            $tTexts = @()
            foreach ($tMatch in $tMatches) {
                # Decode basic XML entities
                $val = $tMatch.Groups[1].Value
                $val = $val.Replace('&amp;', '&').Replace('&lt;', '<').Replace('&gt;', '>').Replace('&quot;', '"').Replace('&apos;', "'")
                $tTexts += $val
            }
            $Paragraphs += ($tTexts -join "")
        }
        
        $Paragraphs -join "`r`n`r`n" | Out-File -FilePath $OutputPath -Encoding utf8
        Write-Host "Success: Output saved to $OutputPath"
    } else {
        Write-Error "word/document.xml not found in archive."
    }

    Remove-Item -Path $TempDir -Recurse -Force
}
catch {
    Write-Error "An error occurred: $_"
}
