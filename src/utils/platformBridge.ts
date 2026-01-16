export interface ElectronAPI {
    saveFile: (content: string, filename: string) => Promise<boolean>;
    readFile: () => Promise<string | null>;
    platform: string;
}



/**
 * Checks if the application is running in an Electron environment.
 */
export const isElectron = (): boolean => {
    return typeof window !== 'undefined' && !!window.electronAPI;
};

/**
 * Validates if the current environment supports filesystem operations via Electron.
 */
export const canUseFileSystem = (): boolean => {
    return isElectron();
};

// Example bridge functions - expand as needed for your application

export const platformSaveFile = async (content: string, filename: string = 'file.txt'): Promise<void> => {
    if (isElectron() && window.electronAPI) {
        await window.electronAPI.saveFile(content, filename);
    } else {
        // Web Fallback: Create a blob and trigger download
        console.log('Web mode: Triggering download for', filename);
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};

export const platformReadFile = async (): Promise<string | null> => {
    if (isElectron() && window.electronAPI) {
        return window.electronAPI.readFile();
    } else {
        // Web Fallback: File input
        return new Promise((resolve) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.txt,.json,.md'; // Update as needed
            input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (!file) {
                    resolve(null);
                    return;
                }
                const reader = new FileReader();
                reader.onload = (e) => {
                    resolve(e.target?.result as string);
                };
                reader.readAsText(file);
            };
            input.click();
        });
    }
};
