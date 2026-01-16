export { };

declare global {
    interface Window {
        electronAPI?: {
            readImageFiles: () => Promise<string[]>;
            readConfig: () => Promise<any>;
            saveConfig: (config: any) => Promise<boolean>;
            searchIcons: (params: { query: string; key: string; secret: string }) => Promise<any>;
            // Additions for Platform Bridge
            saveFile: (content: string, filename: string) => Promise<boolean>;
            readFile: () => Promise<string | null>;
            platform: string;
        };
    }
}
