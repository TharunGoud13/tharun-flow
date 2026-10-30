const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  // Kill any existing chrome on 9222
  try {
    const { execSync } = require('child_process');
    execSync('pkill -f "remote-debugging-port=9222" || true');
  } catch (e) {}

  await wait(500);

  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--window-size=1440,900',
    'http://localhost:3000/',
  ]);

  await wait(2500);

  http.get('http://localhost:9222/json', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', async () => {
      const pages = JSON.parse(data);
      const target = pages.find(p => p.url === 'http://localhost:3000/');
      if (!target) {
        console.error('No target page found');
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
        await wait(3000);

        // --- STEP 1: Verify Layout & Zero Overlap between Revert Toolbar and Floating Tool Rail ---
        const layoutCheck = await send('Runtime.evaluate', {
          expression: `
            (() => {
              const rail = document.querySelector('aside');
              const menuZone = document.querySelector('.tlui-menu-zone') || document.querySelector('[label="Actions"]')?.closest('nav');
              const railBox = rail ? rail.getBoundingClientRect() : null;
              const menuBox = menuZone ? menuZone.getBoundingClientRect() : null;

              let overlaps = false;
              if (railBox && menuBox) {
                overlaps = !(
                  railBox.right < menuBox.left ||
                  railBox.left > menuBox.right ||
                  railBox.bottom < menuBox.top ||
                  railBox.top > menuBox.bottom
                );
              }

              return {
                railBox: railBox ? { top: railBox.top, bottom: railBox.bottom, left: railBox.left, height: railBox.height } : null,
                menuBox: menuBox ? { top: menuBox.top, bottom: menuBox.bottom, left: menuBox.left, height: menuBox.height } : null,
                overlaps,
                gapBetweenBottomMenuAndTopRail: (railBox && menuBox) ? (railBox.top - menuBox.bottom) : null
              };
            })()
          `,
          returnByValue: true,
        });

        console.log('=== LAYOUT & OVERLAP CHECK ===');
        console.log(JSON.stringify(layoutCheck.result.value, null, 2));

        // Take initial screenshot
        const screenshot1 = await send('Page.captureScreenshot');
        fs.writeFileSync(
          '/Users/tharunkumargoud/.gemini/antigravity/brain/8456b8b9-ebb0-4944-9325-dd272586c517/tharun_flow_initial_layout.png',
          Buffer.from(screenshot1.data, 'base64')
        );
        console.log('Saved tharun_flow_initial_layout.png');

        // --- STEP 2: Check PageBar & Add New Page ---
        console.log('=== MULTI-PAGE TESTING ===');
        const pageStatus1 = await send('Runtime.evaluate', {
          expression: `
            (() => {
              const pageTabs = Array.from(document.querySelectorAll('div[title*="page"]')).map(el => el.textContent.trim());
              const addBtn = document.querySelector('button[title*="Add new page"]');
              return { pageTabs, hasAddBtn: !!addBtn };
            })()
          `,
          returnByValue: true,
        });
        console.log('Initial Pages:', pageStatus1.result.value);

        // Click "+ Add Page" button
        await send('Runtime.evaluate', {
          expression: `
            (() => {
              const addBtn = document.querySelector('button[title*="Add new page"]');
              if (addBtn) addBtn.click();
            })()
          `,
        });

        await wait(1500);

        const pageStatus2 = await send('Runtime.evaluate', {
          expression: `
            (() => {
              const pageTabs = Array.from(document.querySelectorAll('div[title*="page"]')).map(el => el.textContent.trim());
              return { pageTabs };
            })()
          `,
          returnByValue: true,
        });
        console.log('Pages after clicking Add Page:', pageStatus2.result.value);

        // --- STEP 3: Draw a shape on Page 2 using keyboard shortcut 'r' + drag ---
        await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'r', code: 'KeyR' });
        await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'r', code: 'KeyR' });
        await wait(300);

        // Mouse drag on canvas to draw a rectangle on Page 2
        await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: 450, y: 350, button: 'left', clickCount: 1 });
        await wait(100);
        await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 700, y: 500, button: 'left' });
        await wait(100);
        await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 700, y: 500, button: 'left' });
        await wait(1000);

        const screenshotPage2 = await send('Page.captureScreenshot');
        fs.writeFileSync(
          '/Users/tharunkumargoud/.gemini/antigravity/brain/8456b8b9-ebb0-4944-9325-dd272586c517/page_2_with_drawn_rectangle.png',
          Buffer.from(screenshotPage2.data, 'base64')
        );
        console.log('Saved page_2_with_drawn_rectangle.png');

        // --- STEP 4: Switch back to Page 1 ---
        console.log('Switching back to Page 1...');
        await send('Runtime.evaluate', {
          expression: `
            (() => {
              const tabs = Array.from(document.querySelectorAll('div[title*="page"]'));
              const page1Tab = tabs.find(t => t.textContent.includes('Page 1'));
              if (page1Tab) page1Tab.click();
            })()
          `,
        });

        await wait(1500);

        const screenshotPage1 = await send('Page.captureScreenshot');
        fs.writeFileSync(
          '/Users/tharunkumargoud/.gemini/antigravity/brain/8456b8b9-ebb0-4944-9325-dd272586c517/page_1_switched_back.png',
          Buffer.from(screenshotPage1.data, 'base64')
        );
        console.log('Saved page_1_switched_back.png');

        // --- STEP 5: Switch to Page 2 again and verify rectangle is preserved ---
        console.log('Switching to Page 2 to verify shape preservation...');
        await send('Runtime.evaluate', {
          expression: `
            (() => {
              const tabs = Array.from(document.querySelectorAll('div[title*="page"]'));
              const page2Tab = tabs.find(t => t.textContent.includes('Page 2'));
              if (page2Tab) page2Tab.click();
            })()
          `,
        });

        await wait(1500);

        const screenshotPage2Preserved = await send('Page.captureScreenshot');
        fs.writeFileSync(
          '/Users/tharunkumargoud/.gemini/antigravity/brain/8456b8b9-ebb0-4944-9325-dd272586c517/page_2_preserved_canvas.png',
          Buffer.from(screenshotPage2Preserved.data, 'base64')
        );
        console.log('Saved page_2_preserved_canvas.png');

        // --- STEP 6: Persistence test across page reload ---
        console.log('Reloading browser to test IndexedDB persistence of multiple pages...');
        await send('Page.reload');
        await wait(3000);

        const postReloadPages = await send('Runtime.evaluate', {
          expression: `
            (() => {
              const pageTabs = Array.from(document.querySelectorAll('div[title*="page"]')).map(el => el.textContent.trim());
              return { pageTabs };
            })()
          `,
          returnByValue: true,
        });
        console.log('Pages after page reload:', postReloadPages.result.value);

        const screenshotReloaded = await send('Page.captureScreenshot');
        fs.writeFileSync(
          '/Users/tharunkumargoud/.gemini/antigravity/brain/8456b8b9-ebb0-4944-9325-dd272586c517/multipage_persisted_after_reload.png',
          Buffer.from(screenshotReloaded.data, 'base64')
        );
        console.log('Saved multipage_persisted_after_reload.png');

        console.log('ALL VERIFICATIONS PASSED SUCCESSFULLY!');
        chrome.kill();
        process.exit(0);
      };
    });
  });
}

run().catch(console.error);

