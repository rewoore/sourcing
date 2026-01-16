import { useState } from 'react';
import Canvas from './components/Editor/Canvas';
import LayerList from './components/Editor/LayerList';
import PropertiesPanel from './components/Editor/PropertiesPanel';
import AIModal from './components/Editor/AIModal';
import LeftSidebar from './components/Layout/LeftSidebar';
import { useEditorStore } from './store/useEditorStore';
import { Square, Circle as CircleIcon, Type, Image as ImageIcon, Save, FolderOpen, Layers, Settings, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { saveProject, loadProject } from '@/services/storageService';

function App() {
  const { addShape, shapes, setShapes } = useEditorStore();
  const [showAIModal, setShowAIModal] = useState(false);

  // Mobile Sidebar States
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);

  const handleAddShape = (type: 'rect' | 'circle' | 'text') => {
    const id = uuidv4();
    addShape({
      id,
      type,
      x: 100, // Center these better in real app
      y: 100,
      width: 100,
      height: 100,
      fill: type === 'rect' ? '#ff0000' : type === 'circle' ? '#00ff00' : '#000000',
      text: type === 'text' ? 'Hello' : undefined,
      fontSize: 24,
    });
    // Close sidebar on mobile on selection if desired, or keep open
  };

  const handleSave = () => {
    saveProject(shapes);
  };

  const handleLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      loadProject(file).then((loadedShapes) => {
        setShapes(loadedShapes);
      });
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gray-50 text-gray-900 font-sans overflow-hidden relative">
      {/* Mobile Header (Visible only on mobile) */}
      <div className="md:hidden h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50">
        <button onClick={() => setShowLeftSidebar(!showLeftSidebar)} className="p-2 -ml-2">
          <Layers size={24} />
        </button>
        <span className="font-semibold">AI Editor</span>
        <button onClick={() => setShowRightSidebar(!showRightSidebar)} className="p-2 -mr-2">
          <Settings size={24} /> {/* Using Settings as proxy for Properties */}
        </button>
      </div>

      {/* Left Sidebar (Tabs + Panel) - Responsive Wrapper */}
      <div className={`
        fixed inset-y-0 left-0 z-40 bg-white shadow-2xl transition-transform duration-300 transform
        ${showLeftSidebar ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:shadow-none md:flex
      `}>
        <LeftSidebar />
        {/* Close button for mobile */}
        <button
          onClick={() => setShowLeftSidebar(false)}
          className="md:hidden absolute top-4 right-4 p-2 bg-gray-100 rounded-full"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 flex flex-col relative h-full">
        {/* Top Toolbar */}
        <div className="h-12 bg-white border-b border-gray-200 flex items-center px-4 gap-2 shadow-sm z-10 overflow-x-auto no-scrollbar">
          <button onClick={() => handleAddShape('rect')} className="p-2 hover:bg-gray-100 rounded flex-shrink-0" title="Rectangle">
            <Square size={20} />
          </button>
          <button onClick={() => handleAddShape('circle')} className="p-2 hover:bg-gray-100 rounded flex-shrink-0" title="Circle">
            <CircleIcon size={20} />
          </button>
          <button onClick={() => handleAddShape('text')} className="p-2 hover:bg-gray-100 rounded flex-shrink-0" title="Text">
            <Type size={20} />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-2 flex-shrink-0"></div>
          {/* AI or Other tools */}
          <button
            onClick={() => setShowAIModal(true)}
            className="p-2 hover:bg-gray-100 rounded text-purple-600 font-medium flex items-center gap-1 flex-shrink-0"
          >
            <ImageIcon size={20} /> <span className="hidden sm:inline">AI Gen</span>
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2 flex-shrink-0"></div>

          <button onClick={handleSave} className="p-2 hover:bg-gray-100 rounded flex-shrink-0" title="Save Project">
            <Save size={20} />
          </button>
          <label className="p-2 hover:bg-gray-100 rounded cursor-pointer flex-shrink-0" title="Load Project">
            <FolderOpen size={20} />
            <input type="file" accept=".json" className="hidden" onChange={handleLoad} />
          </label>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-gray-200 overflow-hidden relative touch-pan-x touch-pan-y">
          <Canvas />
        </div>
      </div>

      {/* Right Sidebar - Properties & Layers - Responsive Wrapper */}
      <div className={`
        fixed inset-y-0 right-0 z-40 w-72 bg-white shadow-2xl border-l border-gray-200 flex flex-col transition-transform duration-300 transform
        ${showRightSidebar ? 'translate-x-0' : 'translate-x-full'}
        lg:translate-x-0 lg:static lg:flex
      `}>
        {/* Close button for mobile */}
        <div className="lg:hidden p-2 flex justify-end border-b border-gray-100">
          <button onClick={() => setShowRightSidebar(false)} className="p-2 bg-gray-100 rounded">
            Close
          </button>
        </div>

        {/* Layers Section */}
        <div className="flex-1 flex flex-col min-h-0 border-b border-gray-200">
          <div className="p-3 border-b border-gray-200 font-semibold text-sm flex items-center gap-2 bg-gray-50">
            <Layers size={16} /> Layers
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <LayerList />
          </div>
        </div>

        {/* Properties Section */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="p-3 border-b border-gray-200 font-semibold text-sm bg-gray-50">Properties</div>
          <div className="flex-1 overflow-y-auto">
            <PropertiesPanel />
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebars */}
      {(showLeftSidebar || showRightSidebar) && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => { setShowLeftSidebar(false); setShowRightSidebar(false); }}
        />
      )}

      {showAIModal && <AIModal onClose={() => setShowAIModal(false)} />}
    </div>
  );
}

export default App;
