const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  console.log('Starting Chrome for Tldraw Studio verification...');
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--window-size=1440,900',
    'http://localhost:3000/',
  ]);

  await wait(2000);

  http.get('http://localhost:9222/json', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', async () => {
      const pages = JSON.parse(data);
      const target = pages.find(p => p.url === 'http://localhost:3000/');
      if (!target) {
        console.error('Target page not found');
        chrome.kill();
        process.exit(1);
      }
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

        await wait(2500);

        // 1. Capture base canvas screenshot
        const shot1 = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(
          '/Users/tharunkumargoud/.gemini/antigravity/brain/8456b8b9-ebb0-4944-9325-dd272586c517/tldraw_canvas_rendered.png',
          Buffer.from(shot1.data, 'base64')
        );
        console.log('1. Saved tldraw_canvas_rendered.png');

        // 2. Click Insert Item / Icon (I) button to open modal
        await send('Runtime.evaluate', {
          expression: `(() => {
            const btn = document.querySelector('button[title*="Insert Item"]');
            if (btn) btn.click();
          })()`
        });
        await wait(800);

        // Capture modal screenshot (comparing to user's uploaded image)
        const shot2 = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(
          '/Users/tharunkumargoud/.gemini/antigravity/brain/8456b8b9-ebb0-4944-9325-dd272586c517/eraser_insert_panel_replicated.png',
          Buffer.from(shot2.data, 'base64')
        );
        console.log('2. Saved eraser_insert_panel_replicated.png');

        // 3. Search for "postgres" in the insert item modal
        await send('Runtime.evaluate', {
          expression: `(() => {
            const input = document.querySelector('input[placeholder="Insert item"]');
            if (input) {
              input.value = "postgres";
              input.dispatchEvent(new Event('input', { bubbles: true }));
            }
          })()`
        });
        await wait(500);

        const shot3 = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(
          '/Users/tharunkumargoud/.gemini/antigravity/brain/8456b8b9-ebb0-4944-9325-dd272586c517/eraser_icon_search.png',
          Buffer.from(shot3.data, 'base64')
        );
        console.log('3. Saved eraser_icon_search.png');

        // 4. Click the first matching icon to insert it onto the canvas
        await send('Runtime.evaluate', {
          expression: `(() => {
            const firstIconBtn = document.querySelector('button[title*="Postgre"]');
            if (firstIconBtn) firstIconBtn.click();
          })()`
        });
        await wait(800);

        const shot4 = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(
          '/Users/tharunkumargoud/.gemini/antigravity/brain/8456b8b9-ebb0-4944-9325-dd272586c517/canvas_after_icon_insert.png',
          Buffer.from(shot4.data, 'base64')
        );
        console.log('4. Saved canvas_after_icon_insert.png');

        ws.close();
        chrome.kill();
        console.log('Verification completed successfully!');
        process.exit(0);
      };
    });
  });
}

run();

