
import React, { DragEvent } from 'react';

interface DraggableProps {
    index: number;
    isDragging: boolean;
    isDragOver: boolean;
    onDragStart: (e: DragEvent<HTMLDivElement>, index: number) => void;
    onDragEnter: (e: DragEvent<HTMLDivElement>, index: number) => void;
    onDragEnd: (e: DragEvent<HTMLDivElement>) => void;
}

// FIX: Omitted conflicting drag event handler props from the wrapped component's props (`P`)
// to resolve type conflicts when the HOC is used. This allows the HOC to define custom signatures
// for drag events (e.g., with an `index` parameter) without clashing with standard React.HTMLAttributes.
export const withDraggable = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    return React.memo((props: Omit<P, 'onDragStart' | 'onDragEnter' | 'onDragEnd'> & DraggableProps) => {
        const { 
            index, 
            isDragging, 
            isDragOver, 
            onDragStart, 
            onDragEnter, 
            onDragEnd, 
            ...rest 
        } = props;
        
        const dragProps = {
            draggable: true,
            onDragStart: (e: DragEvent<HTMLDivElement>) => onDragStart(e, index),
            onDragEnter: (e: DragEvent<HTMLDivElement>) => onDragEnter(e, index),
            onDragEnd: onDragEnd,
            onDragOver: (e: DragEvent<HTMLDivElement>) => e.preventDefault(),
        };

        return (
            <div className="relative">
                {isDragOver && <div className="absolute -left-1 top-0 bottom-0 w-1 bg-amber-500 rounded-full animate-pulse" />}
                <WrappedComponent 
                    className={isDragging ? 'opacity-40' : 'opacity-100'}
                    {...dragProps} 
                    {...(rest as P)} 
                />
            </div>
        );
    });
};