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
        await wait(2000);

        // 1. Press 't' to select text tool
        await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 't', code: 'KeyT' });
        await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 't', code: 'KeyT' });
        await wait(300);

        // 2. Click on canvas at (400, 600) to start typing text
        await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: 400, y: 600, button: 'left', clickCount: 1 });
        await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 400, y: 600, button: 'left' });
        await wait(300);

        // 3. Type text "Microservices Architecture v2"
        const textToType = "Microservices Architecture v2";
        for (const char of textToType) {
          await send('Input.dispatchKeyEvent', { type: 'keyDown', text: char });
          await send('Input.dispatchKeyEvent', { type: 'keyUp' });
          await wait(20);
        }
        await wait(300);

        // 4. Press Escape to commit text
        await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape' });
        await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape' });
        await wait(500);

        const shot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(
          '/Users/tharunkumargoud/.gemini/antigravity/brain/8456b8b9-ebb0-4944-9325-dd272586c517/text_edited_on_canvas.png',
          Buffer.from(shot.data, 'base64')
        );
        console.log('Saved text_edited_on_canvas.png');

        ws.close();
        chrome.kill();
        process.exit(0);
      };
    });
  });
}

run();

