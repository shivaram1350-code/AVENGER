# Simple HTTP Server for Mobile VR Experience
$port = 8000
$root = Get-Location

Write-Host "Starting HTTP Server on port $port" -ForegroundColor Green
Write-Host "Serving files from: $root" -ForegroundColor Yellow
Write-Host "Access the app at: http://localhost:$port" -ForegroundColor Cyan
Write-Host "For mobile access, use your computer's IP address" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Red
Write-Host ""

# Get local IP address
$ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -like "192.168.*" -or $_.IPAddress -like "172.*" -or $_.IPAddress -like "10.*"} | Select-Object -First 1).IPAddress
if ($ip) {
    Write-Host "Mobile URL: http://$ip`:$port" -ForegroundColor Magenta
}

# Create a simple HTTP listener
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://*:$port/")

try {
    $listener.Start()
    Write-Host "Server started successfully!" -ForegroundColor Green
    
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $localPath = $request.Url.LocalPath
        if ($localPath -eq "/") {
            $localPath = "/index.html"
        }
        
        $filePath = Join-Path $root $localPath.TrimStart('/')
        
        if (Test-Path $filePath -PathType Leaf) {
            $content = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $content.Length
            
            # Set content type based on file extension
            $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
            switch ($extension) {
                ".html" { $response.ContentType = "text/html; charset=utf-8" }
                ".css" { $response.ContentType = "text/css; charset=utf-8" }
                ".js" { $response.ContentType = "application/javascript; charset=utf-8" }
                ".json" { $response.ContentType = "application/json; charset=utf-8" }
                ".png" { $response.ContentType = "image/png" }
                ".jpg" { $response.ContentType = "image/jpeg" }
                ".gif" { $response.ContentType = "image/gif" }
                default { $response.ContentType = "text/plain; charset=utf-8" }
            }
            
            $response.OutputStream.Write($content, 0, $content.Length)
            Write-Host "Served: $localPath" -ForegroundColor White
        } else {
            $response.StatusCode = 404
            $errorMessage = "File not found: $localPath"
            $errorBytes = [System.Text.Encoding]::UTF8.GetBytes($errorMessage)
            $response.ContentLength64 = $errorBytes.Length
            $response.OutputStream.Write($errorBytes, 0, $errorBytes.Length)
            Write-Host "404: $localPath" -ForegroundColor Red
        }
        
        $response.Close()
    }
} catch {
    Write-Host "Error starting server: $($_.Exception.Message)" -ForegroundColor Red
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
}
