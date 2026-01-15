import { ipcRenderer, contextBridge } from 'electron';

// Since we are using contextIsolation: false, we just expose to window directly?
// No, preload runs before renderer.
// Actually, with contextIsolation: false, we can attach to window directly.
// But using contextBridge is safer practice even if isolation is off? 
// No, if isolation is false, contextBridge might throw or be useless. 
// Just attach to window.electronAPI as we did before.

(window as any).electronAPI = {
    // Files
    readImageFiles: () => ipcRenderer.invoke('read-image-files'),
    // Config
    readConfig: () => ipcRenderer.invoke('read-config'),
    saveConfig: (config: any) => ipcRenderer.invoke('save-config', config),
    // Custom Proxy
    searchIcons: (params: any) => ipcRenderer.invoke('search-icons', params),
};
