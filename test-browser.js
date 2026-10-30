const { spawn } = require('child_process');
const http = require('http');

async function run() {
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9222',
    'http://localhost:3000/',
  ]);

  await new Promise(r => setTimeout(r, 1500));

  http.get('http://localhost:9222/json', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const pages = JSON.parse(data);
      const target = pages.find(p => p.url === 'http://localhost:3000/');
      if (!target) {
        console.error('Target page not found');
        chrome.kill();
        process.exit(1);
      }

      const ws = new WebSocket(target.webSocketDebuggerUrl);
      ws.onopen = () => {
        // Enable Console and Runtime
        ws.send(JSON.stringify({ id: 1, method: 'Console.enable' }));
        ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));
        ws.send(JSON.stringify({
          id: 3,
          method: 'Runtime.evaluate',
          params: {
            expression: `({
              errors: window.__errors || [],
              nodeCount: document.querySelectorAll('.react-flow__node').length,
              nodeHtmls: Array.from(document.querySelectorAll('.react-flow__node')).map(n => n.outerHTML.slice(0, 200)),
              edgeCount: document.querySelectorAll('.react-flow__edge').length
            })`,
            returnByValue: true
          }
        }));
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.method === 'Console.messageAdded') {
          console.log('[BROWSER CONSOLE]', msg.params.message);
        }
        if (msg.id === 3) {
          console.log('[PAGE EVAL RESULT]', JSON.stringify(msg.result.result.value, null, 2));
          ws.close();
          chrome.kill();
          process.exit(0);
        }
      };
    });
  });
}

run();

