export { };

declare global {
    interface Window {
        electronAPI: {
            readImageFiles: () => Promise<string[]>;
            readConfig: () => Promise<any>;
            saveConfig: (config: any) => Promise<boolean>;
            searchIcons: (params: { query: string; key: string; secret: string }) => Promise<any>;
        };
    }
}
