import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import OAuth from 'oauth-1.0a';
import crypto from 'node:crypto';
// import fetch from 'node-fetch'; // rely on global fetch

process.env.DIST = path.join(__dirname, '../dist');
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public');

let win: BrowserWindow | null;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false, // Ease local file loading issues
      contextIsolation: false, // Ideally true
      nodeIntegration: true,   // Ideally false
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString());
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL as string);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST as string, 'index.html'));
  }
}

// Config Handling
const configPath = path.join(app.getPath('userData'), 'config.json');

ipcMain.handle('read-config', async () => {
  try {
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading config:', err);
  }
  return null;
});

ipcMain.handle('save-config', async (event, config) => {
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    return true;
  } catch (err) {
    console.error('Error saving config:', err);
    return false;
  }
});

// Noun Project Proxy
ipcMain.handle('search-icons', async (event, { query, key, secret }) => {
  if (!key || !secret) return { error: 'Missing credentials' };

  const oauth = new OAuth({
    consumer: { key, secret },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string: string, key: string) {
      return crypto
        .createHmac('sha1', key)
        .update(base_string)
        .digest('base64');
    },
  });

  // URL for Noun Project API v2? Actually v1 is more common for this lib
  // Endpoint: http://api.thenounproject.com/icons/{term}
  const url = `https://api.thenounproject.com/icon/${encodeURIComponent(query)}`;
  // But they have /icons endpoint too. Let's try /icons/<term> which returns list.
  // Documentation: GET /icons/:term
  const iconsUrl = `https://api.thenounproject.com/icons/${encodeURIComponent(query)}?limit=20`;

  const request_data = {
    url: iconsUrl,
    method: 'GET',
  };

  const headers = oauth.toHeader(request_data as any) as unknown as Record<string, string>;

  try {
    const response = await fetch(iconsUrl, {
      method: 'GET',
      headers: {
        ...headers,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      return { error: `API Error: ${response.status} ${errText}` };
    }

    const data = await response.json();
    return data;
  } catch (err: any) {
    return { error: err.message };
  }
});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);
