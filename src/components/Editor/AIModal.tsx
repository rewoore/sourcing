import { useState } from 'react';
import { X, Loader2, Image as ImageIcon } from 'lucide-react';
import { generateImage } from '@/services/aiService';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useEditorStore } from '@/store/useEditorStore';
import { v4 as uuidv4 } from 'uuid';

const AIModal = ({ onClose }: { onClose: () => void }) => {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const { addShape } = useEditorStore();
    const { replicateApiToken } = useSettingsStore();

    const handleGenerate = async () => {
        if (!prompt) return;
        if (!replicateApiToken) {
            alert('Please config Replicate API Token in Settings.');
            return;
        }

        setLoading(true);
        try {
            const imageUrl = await generateImage({ prompt, apiKey: replicateApiToken });

            // Add image to canvas
            addShape({
                id: uuidv4(),
                type: 'image',
                x: 100,
                y: 100,
                width: 512,
                height: 512,
                src: imageUrl,
            });

            onClose();
        } catch (err) {
            console.error(err);
            alert('Failed to generate image. Please check your API key and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-[500px] shadow-xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-purple-100 text-purple-600 rounded">
                            <ImageIcon size={20} />
                        </div>
                        <h2 className="font-semibold text-gray-800">Generate Image</h2>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Prompt</label>
                        <textarea
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-24 resize-none focus:ring-2 focus:ring-purple-500 outline-none"
                            placeholder="Describe the image you want to generate..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                    </div>
                </div>

                <div className="p-4 bg-gray-50 flex justify-end gap-2 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !prompt}
                        className="px-4 py-2 text-sm bg-purple-600 text-white rounded font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading && <Loader2 size={16} className="animate-spin" />}
                        {loading ? 'Generating...' : 'Generate'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIModal;
