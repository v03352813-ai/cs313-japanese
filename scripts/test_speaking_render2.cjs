const http = require('http');
const { spawn } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browser = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=9227',
  '--disable-gpu',
  'about:blank'
]);

setTimeout(async () => {
  try {
    const targets = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9227/json', (res) => {
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
      ws.send(JSON.stringify({ id: 4, method: 'Page.navigate', params: { url: 'http://localhost:5173/#speaking' } }));
    };

    ws.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      if (parsed.method === 'Runtime.consoleAPICalled') {
        console.log('[CONSOLE]', parsed.params.type, parsed.params.args.map(a => a.value || a.description).join(' '));
      } else if (parsed.method === 'Runtime.exceptionThrown') {
        console.error('[EXCEPTION]', JSON.stringify(parsed.params.exceptionDetails, null, 2));
      } else if (parsed.method === 'Page.loadEventFired') {
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 20,
            method: 'Runtime.evaluate',
            params: { expression: '({ title: document.querySelector("h1") ? document.querySelector("h1").innerText : null, error: document.querySelector(".text-slate-900") ? document.querySelector(".text-slate-900").innerText : null, activeTab: window.location.hash })' }
          }));
        }, 1000);
      } else if (parsed.id === 20) {
        console.log('[PAGE EVAL RESULT]:', JSON.stringify(parsed.result?.result?.value, null, 2));
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
