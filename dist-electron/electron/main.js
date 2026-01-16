"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const oauth_1_0a_1 = __importDefault(require("oauth-1.0a"));
const node_crypto_1 = __importDefault(require("node:crypto"));
// import fetch from 'node-fetch'; // rely on global fetch
process.env.DIST = node_path_1.default.join(__dirname, '../dist');
process.env.VITE_PUBLIC = electron_1.app.isPackaged ? process.env.DIST : node_path_1.default.join(process.env.DIST, '../public');
let win;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
function createWindow() {
    win = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: node_path_1.default.join(__dirname, 'preload.js'),
            webSecurity: false, // Ease local file loading issues
            contextIsolation: false, // Ideally true
            nodeIntegration: true, // Ideally false
        },
    });
    // Test active push message to Renderer-process.
    win.webContents.on('did-finish-load', () => {
        win === null || win === void 0 ? void 0 : win.webContents.send('main-process-message', (new Date).toLocaleString());
    });
    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL);
    }
    else {
        // win.loadFile('dist/index.html')
        win.loadFile(node_path_1.default.join(process.env.DIST, 'index.html'));
    }
}
// Config Handling
const configPath = node_path_1.default.join(electron_1.app.getPath('userData'), 'config.json');
electron_1.ipcMain.handle('read-config', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (node_fs_1.default.existsSync(configPath)) {
            const data = node_fs_1.default.readFileSync(configPath, 'utf8');
            return JSON.parse(data);
        }
    }
    catch (err) {
        console.error('Error reading config:', err);
    }
    return null;
}));
electron_1.ipcMain.handle('save-config', (event, config) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        node_fs_1.default.writeFileSync(configPath, JSON.stringify(config, null, 2));
        return true;
    }
    catch (err) {
        console.error('Error saving config:', err);
        return false;
    }
}));
electron_1.ipcMain.handle('save-file', (event, content, filename) => __awaiter(void 0, void 0, void 0, function* () {
    const { filePath } = yield electron_1.dialog.showSaveDialog({
        defaultPath: filename,
        filters: [{ name: 'Project Files', extensions: ['json'] }]
    });
    if (filePath) {
        node_fs_1.default.writeFileSync(filePath, content, 'utf8');
        return true;
    }
    return false;
}));
electron_1.ipcMain.handle('read-file', () => __awaiter(void 0, void 0, void 0, function* () {
    const { filePaths } = yield electron_1.dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Project Files', extensions: ['json'] }]
    });
    if (filePaths && filePaths.length > 0) {
        return node_fs_1.default.readFileSync(filePaths[0], 'utf8');
    }
    return null;
}));
// Noun Project Proxy
electron_1.ipcMain.handle('search-icons', (event_1, _a) => __awaiter(void 0, [event_1, _a], void 0, function* (event, { query, key, secret }) {
    if (!key || !secret)
        return { error: 'Missing credentials' };
    const oauth = new oauth_1_0a_1.default({
        consumer: { key, secret },
        signature_method: 'HMAC-SHA1',
        hash_function(base_string, key) {
            return node_crypto_1.default
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
    const headers = oauth.toHeader(request_data);
    try {
        const response = yield fetch(iconsUrl, {
            method: 'GET',
            headers: Object.assign(Object.assign({}, headers), { 'Accept': 'application/json' })
        });
        if (!response.ok) {
            const errText = yield response.text();
            return { error: `API Error: ${response.status} ${errText}` };
        }
        const data = yield response.json();
        return data;
    }
    catch (err) {
        return { error: err.message };
    }
}));
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
        win = null;
    }
});
electron_1.app.on('activate', () => {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
electron_1.app.whenReady().then(createWindow);
//# sourceMappingURL=main.js.map