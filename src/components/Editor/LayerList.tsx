import { useEditorStore } from '@/store/useEditorStore';
import { Square, Circle, Type, Image as ImageIcon, GripVertical } from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableItem = ({ id, shape, selectedId, selectShape }: any) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'rect': return <Square size={14} />;
            case 'circle': return <Circle size={14} />;
            case 'text': return <Type size={14} />;
            case 'image': return <ImageIcon size={14} />;
            default: return <Square size={14} />;
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-2 p-2 text-sm rounded group ${selectedId === id ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'
                }`}
        >
            <div {...attributes} {...listeners} className="cursor-grab text-gray-400 opacity-0 group-hover:opacity-100">
                <GripVertical size={14} />
            </div>
            <div
                className="flex-1 flex items-center gap-2 cursor-pointer"
                onClick={() => selectShape(id)}
            >
                {getIcon(shape.type)}
                <span className="truncate">{shape.text || shape.type}</span>
            </div>
        </div>
    );
};

const LayerList = () => {
    const { shapes, selectedId, selectShape, setShapes } = useEditorStore();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // We display list in reverse order (Top layer at Top of list)
    const reversedShapes = [...shapes].reverse();

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            // Find indices in the REVERSED array
            const oldRevIndex = reversedShapes.findIndex(s => s.id === active.id);
            const newRevIndex = reversedShapes.findIndex(s => s.id === over.id);

            // Move in reversed array
            const newReversed = arrayMove(reversedShapes, oldRevIndex, newRevIndex);

            // Un-reverse to save (Bottom-up order for Z-index)
            // [.reverse()] mutates, but arrayMove returns new array.
            // Wait, arrayMove returns a new array. .reverse() mutates IT? Yes.
            // Safe to reverse the result of arrayMove.
            setShapes([...newReversed].reverse());
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={reversedShapes.map(s => s.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="flex flex-col gap-1">
                    {reversedShapes.map((shape) => (
                        <SortableItem
                            key={shape.id}
                            id={shape.id}
                            shape={shape}
                            selectedId={selectedId}
                            selectShape={selectShape}
                        />
                    ))}
                    {shapes.length === 0 && <div className="text-gray-400 text-xs text-center mt-4">No layers</div>}
                </div>
            </SortableContext>
        </DndContext>
    );
};

export default LayerList;
