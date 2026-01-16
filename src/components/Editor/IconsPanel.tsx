import { useState, useEffect } from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { v4 as uuidv4 } from 'uuid';
import { Search, Loader2 } from 'lucide-react';

const IconsPanel = () => {
    const [query, setQuery] = useState('');
    const [icons, setIcons] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const { addShape } = useEditorStore();
    const { nounProjectKey, nounProjectSecret } = useSettingsStore();

    const searchIcons = async (searchQuery: string) => {
        if (!searchQuery) return;
        if (!nounProjectKey || !nounProjectSecret) {
            // alert('Please configure Noun Project Key & Secret in Settings.');
            console.warn('Noun Project keys missing');
            return;
        }

        setLoading(true);
        try {
            // Call Electron Proxy
            // Note: Noun Project returns "icons": [...]
            const res = await window.electronAPI.searchIcons({
                query: searchQuery,
                key: nounProjectKey,
                secret: nounProjectSecret
            });

            if (res.error) {
                console.error(res.error);
                // alert(res.error);
            } else {
                setIcons(res.icons || []);
            }
        } catch (err) {
            console.error(err);
            // alert("Failed to fetch icons");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Load default icons on mount
        if (nounProjectKey && nounProjectSecret) {
            searchIcons('ui');
        }
    }, [nounProjectKey, nounProjectSecret]); // Reload if keys change

    const handleSearch = () => {
        searchIcons(query);
    }

    const handleAddIcon = (url: string) => {
        // Noun Project gives SVG url usually, or preview url.
        // We can try to load SVG as image.
        addShape({
            id: uuidv4(),
            type: 'image',
            x: 100,
            y: 100,
            width: 100,
            height: 100,
            src: url
        });
    };

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="p-4 border-b border-gray-200">
                <h2 className="font-bold text-lg mb-2">Icons</h2>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search icons..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <Search className="absolute left-2.5 top-2.5 text-gray-400" size={16} />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 scrollbar-hide">
                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="animate-spin text-gray-500" />
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-2">
                        {icons.map((icon) => (
                            <div
                                key={icon.id}
                                onClick={() => handleAddIcon(icon.icon_url || icon.preview_url)}
                                className="cursor-pointer group p-2 border border-transparent hover:border-blue-100 hover:bg-blue-50 rounded flex items-center justify-center transition-all bg-gray-50"
                                title={icon.term}
                            >
                                <img
                                    src={icon.preview_url}
                                    alt={icon.term}
                                    className="w-full h-16 object-contain"
                                />
                            </div>
                        ))}
                    </div>
                )}
                {icons.length === 0 && !loading && (
                    <div className="text-center text-gray-400 text-sm mt-8">
                        Search for icons <br /> via Noun Project
                    </div>
                )}
            </div>
        </div>
    );
};

export default IconsPanel;
