const http = require('http');
const { spawn } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browser = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=9230',
  '--disable-gpu',
  'about:blank'
]);

setTimeout(async () => {
  try {
    const targets = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9230/json', (res) => {
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
      ws.send(JSON.stringify({ id: 4, method: 'Page.navigate', params: { url: 'http://localhost:5173/#kdrama' } }));
    };

    ws.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      if (parsed.method === 'Runtime.consoleAPICalled') {
        console.log('[BROWSER CONSOLE]', parsed.params.type, parsed.params.args.map(a => a.value || a.description).join(' '));
      } else if (parsed.method === 'Runtime.exceptionThrown') {
        console.error('[BROWSER EXCEPTION]', JSON.stringify(parsed.params.exceptionDetails, null, 2));
      } else if (parsed.method === 'Page.loadEventFired') {
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 30,
            method: 'Runtime.evaluate',
            params: { expression: 'document.body.innerText' }
          }));
        }, 1200);
      } else if (parsed.id === 30) {
        const bodyText = parsed.result?.result?.value || '';
        console.log('=== BROWSER PAGE BODY FOR #kdrama ===');
        console.log(bodyText.substring(0, 400));
        console.log('=====================================');
        ws.close();
        browser.kill();
      }
    };

  } catch (err) {
    console.error('Inspector error:', err);
    browser.kill();
  }
}, 2000);
