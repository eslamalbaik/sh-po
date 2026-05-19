# تشغيل النشر على السيرفر عبر SSH (بعد git push من الجهاز المحلي)
# مثال:
#   .\scripts\Invoke-ProductionDeploy.ps1 -SshTarget "user@mzschool-results.com" -AppPath "/var/www/sh-po"

param(
    [Parameter(Mandatory = $true)]
    [string] $SshTarget,

    [Parameter(Mandatory = $true)]
    [string] $AppPath
)

$remote = @"
set -e
cd '$AppPath'
chmod +x scripts/deploy-production.sh
bash scripts/deploy-production.sh
"@

Write-Host "Deploying on $SshTarget at $AppPath ..."
ssh $SshTarget $remote
Write-Host "Done. Test: https://mzschool-results.com/admin and /parent"
