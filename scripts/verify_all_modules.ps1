Write-Host "==============================================="
Write-Host " VERIFYING ALL KOREAN SYSTEM COMPONENTS & DATA "
Write-Host "==============================================="

$files = @(
  "src\data\korean\writing.ts",
  "src\components\TopikWritingView.tsx",
  "src\data\korean\phonetics.ts",
  "src\components\PhoneticsView.tsx",
  "src\data\korean\mistakeBook.ts",
  "src\components\MistakeNotebookView.tsx",
  "src\components\Navbar.tsx",
  "src\App.tsx",
  "src\components\HomePortal.tsx",
  "src\components\TopikExamView.tsx"
)

foreach ($f in $files) {
  if (Test-Path $f) {
    $len = (Get-Item $f).Length
    Write-Host "[OK] $f ($([math]::Round($len / 1024, 2)) KB)" -ForegroundColor Green
  } else {
    Write-Host "[MISSING] $f" -ForegroundColor Red
  }
}