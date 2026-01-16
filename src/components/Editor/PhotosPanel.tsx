import { useState } from 'react';
import axios from 'axios';
import { useEditorStore } from '@/store/useEditorStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { v4 as uuidv4 } from 'uuid';
import { Search, Loader2 } from 'lucide-react';

const PhotosPanel = () => {
    const [query, setQuery] = useState('');
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const { addShape } = useEditorStore();
    const { unsplashAccessKey } = useSettingsStore();

    const searchImages = async () => {
        if (!query) return;
        if (!unsplashAccessKey) {
            alert('Please configure Unsplash Access Key in Settings.');
            return;
        }

        setLoading(true);

        try {
            const res = await axios.get(`https://api.unsplash.com/search/photos`, {
                params: { query, per_page: 20 },
                headers: {
                    Authorization: `Client-ID ${unsplashAccessKey}`
                }
            });
            setImages(res.data.results);
        } catch (err: any) {
            console.error(err);
            if (err.response?.status === 401) {
                alert("Invalid Unsplash Access Key. Please check settings.");
            } else {
                alert("Failed to fetch images");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAddImage = (url: string) => {
        addShape({
            id: uuidv4(),
            type: 'image',
            x: 100,
            y: 100,
            width: 400,
            height: 300,
            src: url
        });
    };

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="p-4 border-b border-gray-200">
                <h2 className="font-bold text-lg mb-2">Photos</h2>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search photos..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && searchImages()}
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
                    <div className="grid grid-cols-2 gap-2">
                        {images.map((img) => (
                            <div
                                key={img.id}
                                onClick={() => handleAddImage(img.urls.regular)}
                                className="cursor-pointer group relative aspect-w-4 aspect-h-3"
                            >
                                <img
                                    src={img.urls.small}
                                    alt={img.alt_description}
                                    className="w-full h-24 object-cover rounded hover:opacity-80 transition-opacity"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] p-1 opacity-0 group-hover:opacity-100 truncate">
                                    by {img.user.name}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {images.length === 0 && !loading && (
                    <div className="text-center text-gray-400 text-sm mt-8">
                        Search for free photos <br /> via Unsplash
                    </div>
                )}
            </div>
        </div>
    );
};

export default PhotosPanel;
