# Lokale testserver voor de website (alleen op deze computer, poort 8080).
# Wordt gestart via de dev-server "website" in .claude/launch.json.
# POST /__save/<naam>.webp bewaart een bestand in assets/img/ (gebruikt om productfoto's om te zetten).

param([string]$Root = (Get-Location).Path, [int]$Port = 8080)
$types = @{ '.html'='text/html; charset=utf-8'; '.css'='text/css; charset=utf-8'; '.js'='application/javascript; charset=utf-8';
  '.webp'='image/webp'; '.png'='image/png'; '.jpg'='image/jpeg'; '.svg'='image/svg+xml'; '.ico'='image/x-icon'; '.json'='application/json'; '.txt'='text/plain';
  '.xml'='application/xml; charset=utf-8'; '.webmanifest'='application/manifest+json' }
$l = New-Object System.Net.HttpListener
$l.Prefixes.Add("http://localhost:$Port/")
$l.Start()
Write-Host "Serving $Root on http://localhost:$Port/"
while ($l.IsListening) {
  $c = $l.GetContext()
  $p = [Uri]::UnescapeDataString($c.Request.Url.AbsolutePath).TrimStart('/')
  if ($c.Request.HttpMethod -eq 'POST' -and $p -match '^__save/([\w.-]+)$') {
    $ms = New-Object IO.MemoryStream; $c.Request.InputStream.CopyTo($ms)
    [IO.File]::WriteAllBytes((Join-Path $Root "assets\img\$($Matches[1])"), $ms.ToArray())
    Write-Host "SAVED $($Matches[1]) $($ms.Length)"; $c.Response.StatusCode = 204; $c.Response.Close(); continue
  }
  if ($p -eq '' -or $p.EndsWith('/')) { $p += 'index.html' }
  $f = Join-Path $Root $p
  if ((Test-Path $f -PathType Leaf) -and ([IO.Path]::GetFullPath($f).StartsWith([IO.Path]::GetFullPath($Root)))) {
    $b = [IO.File]::ReadAllBytes($f)
    $ext = [IO.Path]::GetExtension($f).ToLower()
    $c.Response.ContentType = $(if ($types[$ext]) { $types[$ext] } else { 'application/octet-stream' })
    $c.Response.Headers.Add('Cache-Control','no-store')
    $c.Response.OutputStream.Write($b, 0, $b.Length)
    Write-Host "200 /$p"
  } else {
    $c.Response.StatusCode = 404
    Write-Host "404 /$p"
  }
  $c.Response.Close()
}
