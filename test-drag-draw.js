const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
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
        await wait(2000);

        // 1. Press 'r' keyboard key to select rectangle tool
        await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'r', code: 'KeyR' });
        await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'r', code: 'KeyR' });
        await wait(300);

        // 2. Click and drag on canvas to draw a rectangle!
        // Start pointer at (700, 450) and drag to (950, 580)
        await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: 700, y: 450, button: 'left', clickCount: 1 });
        await wait(100);
        await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 800, y: 500 });
        await wait(100);
        await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 950, y: 580 });
        await wait(100);
        await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 950, y: 580, button: 'left' });
        await wait(600);

        // 3. Capture screenshot showing newly drawn rectangle!
        const shot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(
          '/Users/tharunkumargoud/.gemini/antigravity/brain/8456b8b9-ebb0-4944-9325-dd272586c517/drawn_rectangle_with_mouse_drag.png',
          Buffer.from(shot.data, 'base64')
        );
        console.log('Saved drawn_rectangle_with_mouse_drag.png');

        ws.close();
        chrome.kill();
        process.exit(0);
      };
    });
  });
}

run();

