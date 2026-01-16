import { useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Circle, Text, Transformer, Image as KonvaImage } from 'react-konva';
import { useEditorStore } from '@/store/useEditorStore';
import useImage from 'use-image';

const URLImage = ({ src, ...props }: any) => {
    const [image] = useImage(src);
    return <KonvaImage image={image} {...props} />;
};

const Canvas = () => {
    const { shapes, selectedId, selectShape, updateShape, stageConfig, setStageConfig } = useEditorStore();

    const checkDeselect = (e: any) => {
        // deselect when clicked on empty area
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            selectShape(null);
        }
    };

    const handleWheel = (e: any) => {
        e.evt.preventDefault();
        const stage = e.target.getStage();
        const scaleBy = 1.1;
        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();

        if (!pointer) return;

        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };

        const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };

        setStageConfig({ scale: newScale, x: newPos.x, y: newPos.y });
    };

    return (
        <div className="bg-gray-100 flex-1 overflow-hidden relative w-full h-full">
            {/* Container must be full size */}
            <Stage
                width={window.innerWidth}
                height={window.innerHeight}
                onMouseDown={checkDeselect}
                onTouchStart={checkDeselect}
                onWheel={handleWheel}
                scaleX={stageConfig.scale}
                scaleY={stageConfig.scale}
                x={stageConfig.x}
                y={stageConfig.y}
                draggable
                onDragEnd={(e) => {
                    // Update stage position in store only if it's the stage dragging
                    if (e.target === e.target.getStage()) {
                        setStageConfig({
                            scale: stageConfig.scale,
                            x: e.target.x(),
                            y: e.target.y()
                        });
                    }
                }}
                className="bg-gray-200"
            >
                <Layer>
                    {shapes.map((shape) => {
                        const commonProps = {
                            key: shape.id,
                            id: shape.id,
                            x: shape.x,
                            y: shape.y,
                            width: shape.width,
                            height: shape.height,
                            rotation: shape.rotation,
                            draggable: true,
                            onClick: () => selectShape(shape.id),
                            onTap: () => selectShape(shape.id),
                            onDragEnd: (e: any) => {
                                updateShape(shape.id, {
                                    x: e.target.x(),
                                    y: e.target.y(),
                                });
                            },
                            onTransformEnd: (e: any) => {
                                // transformer is changing scale and rotation
                                const node = e.target;
                                const scaleX = node.scaleX();
                                const scaleY = node.scaleY();

                                // reset scale to 1 and change width/height
                                node.scaleX(1);
                                node.scaleY(1);

                                updateShape(shape.id, {
                                    x: node.x(),
                                    y: node.y(),
                                    width: Math.max(5, node.width() * scaleX),
                                    height: Math.max(5, node.height() * scaleY),
                                    rotation: node.rotation(),
                                });
                            }
                        };

                        if (shape.type === 'rect') {
                            return <Rect {...commonProps} fill={shape.fill || 'red'} />;
                        } else if (shape.type === 'circle') {
                            return <Circle {...commonProps} fill={shape.fill || 'green'} radius={(shape.width || 50) / 2} />;
                        } else if (shape.type === 'text') {
                            return <Text {...commonProps} text={shape.text || 'Text'} fontSize={shape.fontSize || 20} fill={shape.fill || 'black'} />;
                        } else if (shape.type === 'image' && shape.src) {
                            return <URLImage src={shape.src} {...commonProps} />;
                        }
                        return null;
                    })}

                    <TransformerSelection selectedId={selectedId} />
                </Layer>
            </Stage>
        </div>
    );
};

// Seperate component for Transformer
const TransformerSelection = ({ selectedId }: { selectedId: string | null }) => {
    const trRef = useRef<any>(null);
    const stage = trRef.current?.getStage();

    useEffect(() => {
        if (!trRef.current) return;
        const stage = trRef.current.getStage();
        if (selectedId) {
            const selectedNode = stage.findOne('#' + selectedId);
            if (selectedNode) {
                trRef.current.nodes([selectedNode]);
                trRef.current.getLayer().batchDraw();
            } else {
                trRef.current.nodes([]);
            }
        } else {
            trRef.current.nodes([]);
        }
    }, [selectedId, stage]);

    return <Transformer ref={trRef} />;
}

export default Canvas;
