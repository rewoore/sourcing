import type { ShapeConfig } from '@/store/useEditorStore';

export const saveProject = (shapes: ShapeConfig[]) => {
    const data = JSON.stringify(shapes, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `project-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const loadProject = (file: File): Promise<ShapeConfig[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const result = e.target?.result as string;
                const shapes = JSON.parse(result);
                if (Array.isArray(shapes)) {
                    resolve(shapes);
                } else {
                    reject(new Error('Invalid project file'));
                }
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = reject;
        reader.readAsText(file);
    });
};
