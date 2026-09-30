$ErrorActionPreference = 'Stop'

$package = Get-Content -LiteralPath (Join-Path $PSScriptRoot 'package.json') -Raw | ConvertFrom-Json
$output = Join-Path $PSScriptRoot "$($package.name)-$($package.version).vsix"

& node (Join-Path $PSScriptRoot 'generate-laptop-theme.mjs')
if ($LASTEXITCODE -ne 0) { throw 'Could not generate laptop theme' }
& node (Join-Path $PSScriptRoot 'generate-cyberpunk-plus-theme.mjs')
if ($LASTEXITCODE -ne 0) { throw 'Could not generate Cyberpunk+ theme' }
& node (Join-Path $PSScriptRoot 'generate-overdrive-theme.mjs')
if ($LASTEXITCODE -ne 0) { throw 'Could not generate Overdrive theme' }
& node (Join-Path $PSScriptRoot 'generate-neon-circuit-theme.mjs')
if ($LASTEXITCODE -ne 0) { throw 'Could not generate Neon Circuit theme' }

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

if (Test-Path -LiteralPath $output) {
    Remove-Item -LiteralPath $output
}

$zip = [System.IO.Compression.ZipFile]::Open($output, [System.IO.Compression.ZipArchiveMode]::Create)
try {
    function Add-TextEntry([string]$name, [string]$value) {
        $entry = $zip.CreateEntry($name)
        $writer = [System.IO.StreamWriter]::new($entry.Open(), [System.Text.UTF8Encoding]::new($false))
        try { $writer.Write($value) } finally { $writer.Dispose() }
    }

    function Add-FileEntry([string]$source, [string]$name) {
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $source, $name) | Out-Null
    }

    $xml = @'
<?xml version="1.0" encoding="utf-8"?>
<PackageManifest Version="2.0.0" xmlns="http://schemas.microsoft.com/developer/vsx-schema/2011">
  <Metadata>
    <Identity Language="en-US" Id="neon-district-theme" Version="__VERSION__" Publisher="local" />
    <DisplayName>Neon District — Purple Dashboard</DisplayName>
    <Description xml:space="preserve">A high-contrast cyberpunk VS Code theme with a purple dashboard and orange neon accents.</Description>
    <Categories>Themes</Categories>
    <GalleryFlags>Public</GalleryFlags>
    <Properties>
      <Property Id="Microsoft.VisualStudio.Code.Engine" Value="^1.80.0" />
      <Property Id="Microsoft.VisualStudio.Services.Branding.Color" Value="#1B1727" />
      <Property Id="Microsoft.VisualStudio.Services.Branding.Theme" Value="dark" />
    </Properties>
  </Metadata>
  <Installation>
    <InstallationTarget Id="Microsoft.VisualStudio.Code" />
  </Installation>
  <Dependencies />
  <Assets>
    <Asset Type="Microsoft.VisualStudio.Code.Manifest" Path="extension/package.json" Addressable="true" />
    <Asset Type="Microsoft.VisualStudio.Services.Content.Details" Path="extension/README.md" Addressable="true" />
  </Assets>
</PackageManifest>
'@.Replace('__VERSION__', $package.version)
    Add-TextEntry 'extension.vsixmanifest' $xml

    $contentTypes = @'
<?xml version="1.0" encoding="utf-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="json" ContentType="application/json" />
  <Default Extension="md" ContentType="text/markdown" />
  <Default Extension="js" ContentType="application/javascript" />
  <Default Extension="cjs" ContentType="application/javascript" />
  <Default Extension="css" ContentType="text/css" />
  <Default Extension="html" ContentType="text/html" />
  <Default Extension="woff" ContentType="font/woff" />
  <Default Extension="svg" ContentType="image/svg+xml" />
  <Default Extension="vsixmanifest" ContentType="text/xml" />
</Types>
'@
    Add-TextEntry '[Content_Types].xml' $contentTypes
    Add-FileEntry (Join-Path $PSScriptRoot 'package.json') 'extension/package.json'
    Add-FileEntry (Join-Path $PSScriptRoot 'README.md') 'extension/README.md'
    Add-FileEntry (Join-Path $PSScriptRoot 'themes/neon-district-color-theme.json') 'extension/themes/neon-district-color-theme.json'
    Add-FileEntry (Join-Path $PSScriptRoot 'themes/neon-district-laptop-color-theme.json') 'extension/themes/neon-district-laptop-color-theme.json'
    Add-FileEntry (Join-Path $PSScriptRoot 'themes/neon-district-cyberpunk-plus-color-theme.json') 'extension/themes/neon-district-cyberpunk-plus-color-theme.json'
    Add-FileEntry (Join-Path $PSScriptRoot 'themes/neon-district-overdrive-color-theme.json') 'extension/themes/neon-district-overdrive-color-theme.json'
    Add-FileEntry (Join-Path $PSScriptRoot 'themes/neon-district-neon-circuit-color-theme.json') 'extension/themes/neon-district-neon-circuit-color-theme.json'
    Add-FileEntry (Join-Path $PSScriptRoot 'extension.cjs') 'extension/extension.cjs'
    Add-FileEntry (Join-Path $PSScriptRoot 'deck/index.html') 'extension/deck/index.html'
    Add-FileEntry (Join-Path $PSScriptRoot 'deck/deck.css') 'extension/deck/deck.css'
    Add-FileEntry (Join-Path $PSScriptRoot 'deck/deck.js') 'extension/deck/deck.js'
    Add-FileEntry (Join-Path $PSScriptRoot 'product-icons/overdrive-product-icon-theme.json') 'extension/product-icons/overdrive-product-icon-theme.json'
    Add-FileEntry (Join-Path $PSScriptRoot 'product-icons/overdrive.woff') 'extension/product-icons/overdrive.woff'
    Add-FileEntry (Join-Path $PSScriptRoot 'icons/neon-district-icon-theme.json') 'extension/icons/neon-district-icon-theme.json'
    Get-ChildItem -LiteralPath (Join-Path $PSScriptRoot 'icons/svg') -Filter '*.svg' -File | ForEach-Object {
        Add-FileEntry $_.FullName "extension/icons/svg/$($_.Name)"
    }
}
finally {
    $zip.Dispose()
}

Write-Output $output
