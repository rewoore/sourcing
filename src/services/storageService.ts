import type { ShapeConfig } from '@/store/useEditorStore';
import { platformSaveFile, platformReadFile } from '@/utils/platformBridge';

export const saveProject = async (shapes: ShapeConfig[]) => {
    const data = JSON.stringify(shapes, null, 2);
    // Use the bridge to handle saving (will use Electron IPC if available, or download blob if web)
    await platformSaveFile(data, `project-${Date.now()}.json`);
};

export const loadProject = async (file?: File): Promise<ShapeConfig[]> => {
    // If a file object is provided (Web Drag&Drop or Input), read it directly
    if (file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const result = e.target?.result as string;
                    const shapes = JSON.parse(result);
                    resolve(shapes);
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    // Otherwise, try to use the platform bridge (e.g., Electron Open Dialog)
    // Note: platformReadFile currently handles the file picker dialog for web fallback too if called without args,
    // but here we align with the App.tsx which passes a file from an input.
    // Ideally, App.tsx should validly call loadProject() without args for Electron "Open" menu,
    // but for now we keep the existing signature support.

    // For specific Electron "Open" button support (not <input>), we would call:
    const content = await platformReadFile();
    if (content) {
        return JSON.parse(content);
    }
    return [];
};
