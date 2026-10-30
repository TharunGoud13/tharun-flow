const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  console.log('Starting Chrome for end-to-end verification...');
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--window-size=1440,900',
    'http://localhost:3000/',
  ]);

  await wait(1500);

  http.get('http://localhost:9222/json', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', async () => {
      const pages = JSON.parse(data);
      const target = pages.find(p => p.url === 'http://localhost:3000/');
      const ws = new WebSocket(target.webSocketDebuggerUrl);

      let msgId = 1;
      const send = (method, params = {}) => {
        const id = msgId++;
        return new Promise(resolve => {
          const handler = (event) => {
            const resp = JSON.parse(event.data);
            if (resp.id === id) {
              ws.removeEventListener('message', handler);
              resolve(resp.result);
            }
          };
          ws.addEventListener('message', handler);
          ws.send(JSON.stringify({ id, method, params }));
        });
      };

      ws.onopen = async () => {
        console.log('Connected to Chrome DevTools WebSocket.');

        await wait(1000);

        // Capture base canvas screenshot
        const shot1 = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(
          '/Users/tharunkumargoud/.gemini/antigravity/brain/8456b8b9-ebb0-4944-9325-dd272586c517/canvas_perfect.png',
          Buffer.from(shot1.data, 'base64')
        );
        console.log('1. Saved canvas_perfect.png');

        // Click on Diagram-as-Code button
        await send('Runtime.evaluate', {
          expression: `(() => {
            const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Diagram-as-Code'));
            if (btn) btn.click();
          })()`
        });
        await wait(600);

        // Capture screenshot with DSL panel open
        const shot2 = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(
          '/Users/tharunkumargoud/.gemini/antigravity/brain/8456b8b9-ebb0-4944-9325-dd272586c517/dsl_panel_open.png',
          Buffer.from(shot2.data, 'base64')
        );
        console.log('2. Saved dsl_panel_open.png');

        // Click "Compile & Layout" button
        await send('Runtime.evaluate', {
          expression: `(() => {
            const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Compile & Layout'));
            if (btn) btn.click();
          })()`
        });
        await wait(800);

        // Close DSL panel
        await send('Runtime.evaluate', {
          expression: `(() => {
            const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Diagram-as-Code'));
            if (btn) btn.click();
          })()`
        });
        await wait(600);

        // Capture screenshot of compiled diagram
        const shot3 = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(
          '/Users/tharunkumargoud/.gemini/antigravity/brain/8456b8b9-ebb0-4944-9325-dd272586c517/dsl_compiled_canvas.png',
          Buffer.from(shot3.data, 'base64')
        );
        console.log('3. Saved dsl_compiled_canvas.png');

        // Open Tech Icon Library
        await send('Runtime.evaluate', {
          expression: `(() => {
            const btn = document.querySelector('button[title*="Add Tech Architecture Node"]');
            if (btn) btn.click();
          })()`
        });
        await wait(600);

        const shot4 = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(
          '/Users/tharunkumargoud/.gemini/antigravity/brain/8456b8b9-ebb0-4944-9325-dd272586c517/icon_palette_open.png',
          Buffer.from(shot4.data, 'base64')
        );
        console.log('4. Saved icon_palette_open.png');

        ws.close();
        chrome.kill();
        console.log('Verification run complete!');
        process.exit(0);
      };
    });
  });
}

run();

