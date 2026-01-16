import { useState } from 'react';
import { LayoutTemplate, Type, Image as ImageIcon, Shapes, Upload, MousePointer2, Settings } from 'lucide-react';
import PhotosPanel from '../Editor/PhotosPanel';
import IconsPanel from '../Editor/IconsPanel';
import SettingsModal from '../SettingsModal';

const LeftSidebar = () => {
    const [activeTab, setActiveTab] = useState('photos'); // Default to photos for demo
    const [showSettingsModal, setShowSettingsModal] = useState(false);

    const tabs = [
        { id: 'design', icon: <MousePointer2 size={24} />, label: 'Design' },
        { id: 'templates', icon: <LayoutTemplate size={24} />, label: 'Templates' },
        { id: 'text', icon: <Type size={24} />, label: 'Text' },
        { id: 'photos', icon: <ImageIcon size={24} />, label: 'Photos' },
        { id: 'elements', icon: <Shapes size={24} />, label: 'Elements' },
        { id: 'upload', icon: <Upload size={24} />, label: 'Upload' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'photos':
                return <PhotosPanel />;
            case 'text':
                return (
                    <div className="p-4">
                        <h2 className="font-bold text-lg mb-4">Text</h2>
                        <p className="text-gray-500 text-sm">Text templates coming soon.</p>
                    </div>
                );
            case 'elements':
                return <IconsPanel />;
            case 'design':
                return (
                    <div className="p-4">
                        <h2 className="font-bold text-lg mb-4">Design</h2>
                        <p className="text-gray-500 text-sm">Design settings.</p>
                    </div>
                );
            case 'settings':
                return (
                    <div className="p-4 h-full">
                        <h2 className="font-bold text-lg mb-4">Settings</h2>
                        <p className="text-sm text-gray-500 mb-4">Click below to open settings modal.</p>
                        <button
                            onClick={() => setShowSettingsModal(true)}
                            className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium"
                        >
                            Manage API Keys
                        </button>
                    </div>
                );
            default:
                return (
                    <div className="p-4 flex flex-col items-center justify-center h-full text-gray-400">
                        <span className="capitalize font-semibold">{activeTab}</span>
                        <span className="text-sm">Coming Soon</span>
                    </div>
                );
        }
    };

    return (
        <div className="flex h-full border-r border-gray-200 bg-gray-900">
            {/* Icon Tabs */}
            <div className="flex flex-col w-[72px] items-center py-4 gap-4 flex-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex flex-col items-center gap-1 p-2 rounded w-16 transition-colors ${activeTab === tab.id
                            ? 'bg-gray-800 text-white'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        {tab.icon}
                        <span className="text-[10px] font-medium">{tab.label}</span>
                    </button>
                ))}

                {/* Settings Tab - Pushed to bottom */}
                <div className="mt-auto mb-4 border-t border-gray-700 w-full pt-4 flex flex-col items-center">
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`flex flex-col items-center gap-1 p-2 rounded w-16 transition-colors ${activeTab === 'settings'
                            ? 'bg-gray-800 text-white'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <Settings size={24} />
                        <span className="text-[10px] font-medium">Settings</span>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="w-[300px] bg-white h-full flex flex-col relative">
                {renderContent()}
            </div>

            {showSettingsModal && <SettingsModal onClose={() => setShowSettingsModal(false)} />}
        </div>
    );
};

export default LeftSidebar;
