const http = require('http');
const { spawn } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browser = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=9225',
  '--disable-gpu',
  'http://localhost:5173/#speaking'
]);

setTimeout(async () => {
  try {
    const targets = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9225/json', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const pageTarget = targets.find(t => t.type === 'page');
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Log.enable' }));
      ws.send(JSON.stringify({ id: 3, method: 'Page.enable' }));
      
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 10,
          method: 'Runtime.evaluate',
          params: { expression: 'document.querySelector("#root") ? document.querySelector("#root").innerHTML : "NO_ROOT"' }
        }));
      }, 1500);
    };

    ws.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      if (parsed.method === 'Runtime.consoleAPICalled') {
        console.log('[BROWSER CONSOLE]', parsed.params.type, parsed.params.args.map(a => a.value || a.description).join(' '));
      } else if (parsed.method === 'Runtime.exceptionThrown') {
        console.error('[BROWSER EXCEPTION]', JSON.stringify(parsed.params.exceptionDetails, null, 2));
      } else if (parsed.id === 10) {
        console.log('[ROOT INNER HTML (first 500 chars)]:', parsed.result?.result?.value?.substring(0, 500));
        setTimeout(() => {
          ws.close();
          browser.kill();
        }, 500);
      }
    };

  } catch (err) {
    console.error('Inspector error:', err);
    browser.kill();
  }
}, 2000);
