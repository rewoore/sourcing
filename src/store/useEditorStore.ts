import { create } from 'zustand';

export interface ShapeConfig {
    id: string;
    type: 'rect' | 'circle' | 'text' | 'image';
    x: number;
    y: number;
    width?: number;
    height?: number;
    fill?: string;
    stroke?: string;
    text?: string;
    fontSize?: number;
    src?: string; // for images
    rotation?: number;
}

interface EditorState {
    shapes: ShapeConfig[];
    selectedId: string | null;
    stageConfig: { scale: number; x: number; y: number };
    addShape: (shape: ShapeConfig) => void;
    updateShape: (id: string, newConfig: Partial<ShapeConfig>) => void;
    selectShape: (id: string | null) => void;
    setStageConfig: (config: { scale: number; x: number; y: number }) => void;
    setShapes: (shapes: ShapeConfig[]) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
    shapes: [],
    selectedId: null,
    stageConfig: { scale: 1, x: 0, y: 0 },
    addShape: (shape) => set((state) => ({ shapes: [...state.shapes, shape] })),
    updateShape: (id, newConfig) =>
        set((state) => ({
            shapes: state.shapes.map((shape) =>
                shape.id === id ? { ...shape, ...newConfig } : shape
            ),
        })),
    selectShape: (id) => set({ selectedId: id }),
    setStageConfig: (config) => set({ stageConfig: config }),
    setShapes: (shapes) => set({ shapes }),
}));
