
import { useEditorStore } from '@/store/useEditorStore';

const PropertiesPanel = () => {
    const { shapes, selectedId, updateShape } = useEditorStore();
    const selectedShape = shapes.find(s => s.id === selectedId);

    if (!selectedShape) {
        return (
            <div className="p-4 text-gray-400 text-sm text-center">
                Select an object to edit properties.
            </div>
        );
    }

    const handleChange = (key: string, value: any) => {
        let parsedValue = value;
        if (key === 'x' || key === 'y' || key === 'width' || key === 'height' || key === 'rotation' || key === 'fontSize') {
            parsedValue = parseFloat(value);
        }
        updateShape(selectedShape.id, { [key]: parsedValue });
    };

    return (
        <div className="p-4 space-y-4">
            <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase">Position</label>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <span className="text-xs text-gray-400">X</span>
                        <input
                            type="number"
                            value={Math.round(selectedShape.x)}
                            onChange={(e) => handleChange('x', e.target.value)}
                            className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                        />
                    </div>
                    <div>
                        <span className="text-xs text-gray-400">Y</span>
                        <input
                            type="number"
                            value={Math.round(selectedShape.y)}
                            onChange={(e) => handleChange('y', e.target.value)}
                            className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase">Dimensions</label>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <span className="text-xs text-gray-400">W</span>
                        <input
                            type="number"
                            value={Math.round(selectedShape.width || 0)}
                            onChange={(e) => handleChange('width', e.target.value)}
                            className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                        />
                    </div>
                    <div>
                        <span className="text-xs text-gray-400">H</span>
                        <input
                            type="number"
                            value={Math.round(selectedShape.height || 0)}
                            onChange={(e) => handleChange('height', e.target.value)}
                            className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Rotation</span>
                    <input
                        type="number"
                        value={Math.round(selectedShape.rotation || 0)}
                        onChange={(e) => handleChange('rotation', e.target.value)}
                        className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase">Appearance</label>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 w-8">Fill</span>
                    <input
                        type="color"
                        value={selectedShape.fill || '#000000'}
                        onChange={(e) => handleChange('fill', e.target.value)}
                        className="w-8 h-8 p-0 border-0"
                    />
                    <input
                        type="text"
                        value={selectedShape.fill || ''}
                        onChange={(e) => handleChange('fill', e.target.value)}
                        className="flex-1 text-sm border border-gray-300 rounded px-2 py-1"
                    />
                </div>
            </div>

            {selectedShape.type === 'text' && (
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Text</label>
                    <textarea
                        value={selectedShape.text || ''}
                        onChange={(e) => handleChange('text', e.target.value)}
                        className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                        rows={3}
                    />
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">Size</span>
                        <input
                            type="number"
                            value={selectedShape.fontSize || 12}
                            onChange={(e) => handleChange('fontSize', e.target.value)}
                            className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertiesPanel;
