import { useState, useEffect } from 'react';
import { X, Save, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';

const SettingsModal = ({ onClose }: { onClose: () => void }) => {
    const {
        unsplashAccessKey,
        replicateApiToken,
        nounProjectKey,
        nounProjectSecret,
        setUnsplashAccessKey,
        setReplicateApiToken,
        setNounProjectKey,
        setNounProjectSecret,
        saveSettings
    } = useSettingsStore();

    const [showUnsplash, setShowUnsplash] = useState(false);
    const [showReplicate, setShowReplicate] = useState(false);
    const [showNounKey, setShowNounKey] = useState(false);
    const [showNounSecret, setShowNounSecret] = useState(false);
    const [savedStatus, setSavedStatus] = useState<'saved' | 'modified' | null>(null);

    useEffect(() => {
        // Check if we have saved values initially
        // In a real app, we might compare with disk. 
        // Here, if keys exist on load, we assume they are from config/storage.
        if (unsplashAccessKey || replicateApiToken || nounProjectKey) {
            setSavedStatus('saved');
        }
    }, []);

    const handleChange = (setter: (val: string) => void, val: string) => {
        setter(val);
        setSavedStatus('modified');
    };

    const handleSave = async () => {
        await saveSettings();
        setSavedStatus('saved');
        // onClose(); // User might want to see the "Saved" status
        setTimeout(() => onClose(), 800);
    };

    const InputField = ({
        label,
        value,
        onChange,
        show,
        setShow,
        placeholder,
        desc
    }: any) => (
        <div className="flex flex-col gap-2 mb-4">
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">{label}</label>
                {value && savedStatus === 'saved' && (
                    <span className="text-[10px] flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 size={10} /> Saved
                    </span>
                )}
                {value && savedStatus === 'modified' && (
                    <span className="text-[10px] flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                        <AlertCircle size={10} /> Modified
                    </span>
                )}
            </div>
            <div className="relative">
                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full border rounded px-3 py-2 text-sm outline-none pr-10 ${value ? (savedStatus === 'saved' ? 'border-green-300 focus:ring-green-500' : 'border-gray-300 focus:ring-purple-500') : 'border-gray-300 focus:ring-purple-500'
                        }`}
                    placeholder={placeholder}
                />
                <button
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>
            {desc && <p className="text-xs text-gray-400">{desc}</p>}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-[480px] shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
                    <h2 className="font-semibold text-gray-800">Settings</h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 flex-col gap-6 overflow-y-auto">
                    <InputField
                        label="Unsplash Access Key"
                        value={unsplashAccessKey}
                        onChange={(v: string) => handleChange(setUnsplashAccessKey, v)}
                        show={showUnsplash}
                        setShow={setShowUnsplash}
                        placeholder="Enter key..."
                        desc="Required for searching photos."
                    />

                    <InputField
                        label="Replicate API Token"
                        value={replicateApiToken}
                        onChange={(v: string) => handleChange(setReplicateApiToken, v)}
                        show={showReplicate}
                        setShow={setShowReplicate}
                        placeholder="r8_CBB..."
                        desc="Required for AI image generation."
                    />

                    <hr className="my-4 border-gray-100" />
                    <h3 className="text-sm font-bold text-gray-800 mb-4">Noun Project (Icons)</h3>

                    <InputField
                        label="API Key"
                        value={nounProjectKey}
                        onChange={(v: string) => handleChange(setNounProjectKey, v)}
                        show={showNounKey}
                        setShow={setShowNounKey}
                        placeholder="Key..."
                    />

                    <InputField
                        label="API Secret"
                        value={nounProjectSecret}
                        onChange={(v: string) => handleChange(setNounProjectSecret, v)}
                        show={showNounSecret}
                        setShow={setShowNounSecret}
                        placeholder="Secret..."
                    />
                </div>

                <div className="p-4 bg-gray-50 flex justify-end gap-2 border-t border-gray-100 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 text-sm bg-purple-600 text-white rounded font-medium hover:bg-purple-700 flex items-center gap-1"
                    >
                        <Save size={16} /> Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
