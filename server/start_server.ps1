$env:ELECTRON_RUN_AS_NODE = "1"
$ideExe = "C:\Users\cheng\AppData\Local\Programs\Antigravity IDE\Antigravity IDE.exe"
$scriptPath = "d:\小语种学习\cs313-korean\server\server.cjs"
Start-Process -FilePath $ideExe -ArgumentList "`"$scriptPath`"" -WorkingDirectory "d:\小语种学习\cs313-korean" -NoNewWindow
