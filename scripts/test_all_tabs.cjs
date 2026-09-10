const http = require('http');
const { spawn } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browser = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=9232',
  '--disable-gpu',
  'about:blank'
]);

const tabs = ['home', 'speaking', 'listening', 'kdrama', 'exam', 'vocab', 'grammar'];

setTimeout(async () => {
  try {
    const targets = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9232/json', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const pageTarget = targets.find(t => t.type === 'page');
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

    let currentIndex = 0;
    let errorsFound = [];

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Log.enable' }));
      ws.send(JSON.stringify({ id: 3, method: 'Page.enable' }));
      ws.send(JSON.stringify({ id: 4, method: 'Page.navigate', params: { url: 'http://localhost:5173/' } }));
    };

    ws.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      if (parsed.method === 'Runtime.consoleAPICalled' && parsed.params.type === 'error') {
        const errMsg = parsed.params.args.map(a => a.value || a.description).join(' ');
        console.error(`[CONSOLE ERROR]:`, errMsg);
        errorsFound.push(errMsg);
      } else if (parsed.method === 'Runtime.exceptionThrown') {
        console.error(`[BROWSER EXCEPTION]:`, parsed.params.exceptionDetails?.text);
        errorsFound.push(parsed.params.exceptionDetails);
      } else if (parsed.method === 'Page.loadEventFired') {
        runTabCheck();
      } else if (parsed.id >= 100 && parsed.id < 200) {
        const result = parsed.result?.result?.value;
        console.log(`Tab [${tabs[currentIndex]}]: Has ErrorBoundary? ${result?.hasError ? 'YES (CRASHED!)' : 'NO (PASSED!)'} | Title: ${result?.firstHeading || result?.snippet}`);
        if (result?.hasError) {
          errorsFound.push(`Tab ${tabs[currentIndex]} crashed with ErrorBoundary`);
        }
        currentIndex++;
        if (currentIndex < tabs.length) {
          setTimeout(runTabCheck, 400);
        } else {
          console.log('\n========================================');
          if (errorsFound.length === 0) {
            console.log('🎉 ALL 7 TABS PASSED 100% HEALTH CHECK WITH ZERO CRASHES!');
          } else {
            console.error('❌ ISSUES FOUND:', errorsFound);
          }
          console.log('========================================\n');
          ws.close();
          browser.kill();
        }
      }
    };

    function runTabCheck() {
      const tab = tabs[currentIndex];
      const expr = `(() => {
        window.location.hash = '${tab}';
        const bodyText = document.body.innerText;
        return {
          tab: '${tab}',
          hasError: bodyText.includes('自愈重载'),
          firstHeading: document.querySelector('h1, h2, h3')?.innerText || '',
          snippet: bodyText.substring(0, 100)
        };
      })()`;

      ws.send(JSON.stringify({
        id: 100 + currentIndex,
        method: 'Runtime.evaluate',
        params: { expression: expr, returnByValue: true }
      }));
    }

  } catch (err) {
    console.error('Inspector error:', err);
    browser.kill();
  }
}, 2000);
