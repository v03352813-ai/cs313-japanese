const http = require('http');
const { spawn } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browser = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=9231',
  '--disable-gpu',
  'about:blank'
]);

const routes = ['#home', '#speaking', '#listening', '#kdrama', '#exam', '#vocab', '#grammar'];

setTimeout(async () => {
  try {
    const targets = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9231/json', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const pageTarget = targets.find(t => t.type === 'page');
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

    let currentRouteIndex = 0;
    let errorsFound = [];

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Log.enable' }));
      ws.send(JSON.stringify({ id: 3, method: 'Page.enable' }));
      testNextRoute();
    };

    function testNextRoute() {
      if (currentRouteIndex >= routes.length) {
        console.log('=== ALL ROUTES TEST SUMMARY ===');
        if (errorsFound.length === 0) {
          console.log('✅ ALL 7 ROUTES RENDERED CLEANLY WITHOUT EXCEPTIONS!');
        } else {
          console.error('❌ ERRORS DETECTED:', errorsFound);
        }
        ws.close();
        browser.kill();
        return;
      }

      const route = routes[currentRouteIndex];
      console.log(`\nTesting route: http://localhost:5173/${route} ...`);
      ws.send(JSON.stringify({ id: 100 + currentRouteIndex, method: 'Page.navigate', params: { url: `http://localhost:5173/${route}` } }));
    }

    ws.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      if (parsed.method === 'Runtime.consoleAPICalled' && parsed.params.type === 'error') {
        const errMsg = parsed.params.args.map(a => a.value || a.description).join(' ');
        console.error(`[ERROR ON ${routes[currentRouteIndex]}]:`, errMsg);
        errorsFound.push({ route: routes[currentRouteIndex], error: errMsg });
      } else if (parsed.method === 'Runtime.exceptionThrown') {
        console.error(`[EXCEPTION ON ${routes[currentRouteIndex]}]:`, parsed.params.exceptionDetails?.text);
        errorsFound.push({ route: routes[currentRouteIndex], exception: parsed.params.exceptionDetails });
      } else if (parsed.method === 'Page.loadEventFired') {
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 200 + currentRouteIndex,
            method: 'Runtime.evaluate',
            params: { expression: 'document.body.innerText' }
          }));
        }, 800);
      } else if (parsed.id >= 200 && parsed.id < 300) {
        const bodyText = parsed.result?.result?.value || '';
        const hasErrorBoundary = bodyText.includes('自愈重载');
        console.log(`Route [${routes[currentRouteIndex]}] rendered. Has ErrorBoundary? ${hasErrorBoundary ? 'YES (CRASHED!)' : 'NO (PASSED!)'}`);
        if (hasErrorBoundary) {
          errorsFound.push({ route: routes[currentRouteIndex], error: 'ErrorBoundary shown in DOM' });
        }
        currentRouteIndex++;
        setTimeout(testNextRoute, 300);
      }
    };

  } catch (err) {
    console.error('Inspector error:', err);
    browser.kill();
  }
}, 2000);
