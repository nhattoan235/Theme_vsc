$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$package = Get-Content -LiteralPath (Join-Path $root 'package.json') -Raw | ConvertFrom-Json
$design = Get-Content -LiteralPath (Join-Path $root 'design.json') -Raw | ConvertFrom-Json
$material = Join-Path $env:USERPROFILE ".vscode\extensions\pkief.material-icon-theme-$($design.materialVersion)"
if (-not (Test-Path -LiteralPath $material)) { throw "Material Icon Theme $($design.materialVersion) is not installed" }

& node (Join-Path $root 'generate.mjs')
if ($LASTEXITCODE -ne 0) { throw 'Could not generate icon theme' }

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$output = Join-Path $root "$($package.name)-$($package.version).vsix"
if (Test-Path -LiteralPath $output) { Remove-Item -LiteralPath $output }
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

    $manifest = @'
<?xml version="1.0" encoding="utf-8"?>
<PackageManifest Version="2.0.0" xmlns="http://schemas.microsoft.com/developer/vsx-schema/2011">
  <Metadata>
    <Identity Language="en-US" Id="material-neon-icons" Version="__VERSION__" Publisher="local" />
    <DisplayName>Material Neon Icons</DisplayName>
    <Description xml:space="preserve">Material Icon Theme file icons with distinct folders and custom Markdown and CSV icons.</Description>
    <Categories>Themes</Categories>
    <GalleryFlags>Public</GalleryFlags>
    <Properties><Property Id="Microsoft.VisualStudio.Code.Engine" Value="^1.80.0" /></Properties>
  </Metadata>
  <Installation><InstallationTarget Id="Microsoft.VisualStudio.Code" /></Installation>
  <Dependencies />
  <Assets>
    <Asset Type="Microsoft.VisualStudio.Code.Manifest" Path="extension/package.json" Addressable="true" />
    <Asset Type="Microsoft.VisualStudio.Services.Content.Details" Path="extension/README.md" Addressable="true" />
    <Asset Type="Microsoft.VisualStudio.Services.Content.License" Path="extension/LICENSE-MATERIAL.txt" Addressable="true" />
  </Assets>
</PackageManifest>
'@.Replace('__VERSION__', $package.version)
    Add-TextEntry 'extension.vsixmanifest' $manifest
    Add-TextEntry '[Content_Types].xml' @'
<?xml version="1.0" encoding="utf-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="json" ContentType="application/json" />
  <Default Extension="svg" ContentType="image/svg+xml" />
  <Default Extension="txt" ContentType="text/plain" />
  <Default Extension="md" ContentType="text/markdown" />
  <Default Extension="vsixmanifest" ContentType="text/xml" />
</Types>
'@
    Add-FileEntry (Join-Path $root 'package.json') 'extension/package.json'
    Add-FileEntry (Join-Path $root 'README.md') 'extension/README.md'
    Add-FileEntry (Join-Path $root 'generated/LICENSE-MATERIAL.txt') 'extension/LICENSE-MATERIAL.txt'
    Add-FileEntry (Join-Path $root 'generated/dist/material-icons.json') 'extension/dist/material-icons.json'

    Get-ChildItem -LiteralPath (Join-Path $material 'icons') -File | ForEach-Object {
        Add-FileEntry $_.FullName "extension/icons/$($_.Name)"
    }
    Get-ChildItem -LiteralPath (Join-Path $root 'generated/icons/custom') -File | ForEach-Object {
        Add-FileEntry $_.FullName "extension/icons/custom/$($_.Name)"
    }
}
finally { $zip.Dispose() }

Write-Output $output
