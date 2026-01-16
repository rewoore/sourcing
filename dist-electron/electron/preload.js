"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Since we are using contextIsolation: false, we just expose to window directly?
// No, preload runs before renderer.
// Actually, with contextIsolation: false, we can attach to window directly.
// But using contextBridge is safer practice even if isolation is off? 
// No, if isolation is false, contextBridge might throw or be useless. 
// Just attach to window.electronAPI as we did before.
window.electronAPI = {
    // Files
    readImageFiles: () => electron_1.ipcRenderer.invoke('read-image-files'),
    // Config
    readConfig: () => electron_1.ipcRenderer.invoke('read-config'),
    saveConfig: (config) => electron_1.ipcRenderer.invoke('save-config', config),
    // Custom Proxy
    searchIcons: (params) => electron_1.ipcRenderer.invoke('search-icons', params),
};
//# sourceMappingURL=preload.js.map